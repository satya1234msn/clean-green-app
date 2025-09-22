import { io } from 'socket.io-client';
import getEnvVars from '../config';

const { API_BASE_URL } = getEnvVars();

// Singleton socket and listener guards
let socket = null;
const registeredEvents = new Set();
let currentUserId = null;
let connectPromise = null;

export const notificationService = {
  // Initialize or reuse socket connection
  init: (userId) => {
    const serverUrl = API_BASE_URL.replace('/api', '');
    if (socket && socket.connected && currentUserId === userId) {
      return socket;
    }
    if (socket) {
      try { socket.removeAllListeners(); } catch {}
      try { socket.disconnect(); } catch {}
    }
    registeredEvents.clear();
    currentUserId = userId;

    socket = io(serverUrl, {
      transports: ['websocket'],
      forceNew: true,
      auth: { userId }
    });

    // Promise that resolves on first connect
    connectPromise = new Promise((resolve) => {
      socket.once('connect', () => resolve(true));
    });

    socket.on('connect', () => {
      console.log('Connected to notification server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from notification server');
    });

    return socket;
  },

  // Await active connection after init
  waitUntilConnected: async () => {
    try {
      if (socket?.connected) return true;
      return await Promise.race([
        connectPromise,
        new Promise((res) => setTimeout(() => res(false), 8000))
      ]);
    } catch {
      return false;
    }
  },

  // Join delivery room for pickup notifications
  joinDeliveryRoom: (deliveryId) => {
    if (!socket || !deliveryId) return;
    if (!socket.connected) {
      socket.once('connect', () => socket.emit('join-delivery-room', deliveryId));
    } else {
      socket.emit('join-delivery-room', deliveryId);
    }
  },

  // Join user room for general notifications
  joinUserRoom: (userId) => {
    if (!socket || !userId) return;
    if (!socket.connected) {
      socket.once('connect', () => socket.emit('join-user-room', userId));
    } else {
      socket.emit('join-user-room', userId);
    }
  },

  // Listen for pickup requests (deduplicated)
  onPickupRequest: (callback) => {
    if (!socket) return;
    const evt = 'pickup-request';
    if (registeredEvents.has(evt)) {
      socket.removeAllListeners(evt);
    }
    socket.on(evt, (data) => {
      console.log('Pickup request received:', data);
      callback?.(data);
    });
    registeredEvents.add(evt);
  },

  // Listen for new pickup available - simplified
  onNewPickupAvailable: (callback) => {
    if (!socket) return;
    const evt = 'new-pickup-available';
    if (registeredEvents.has(evt)) {
      socket.removeAllListeners(evt);
    }
    socket.on(evt, (data) => {
      console.log('New pickup available:', data);
      callback?.(data);
    });
    registeredEvents.add(evt);
  },

  // Listen for generic new-pickup event
  onNewPickup: (callback) => {
    if (!socket) return;
    const evt = 'new-pickup';
    if (registeredEvents.has(evt)) {
      socket.removeAllListeners(evt);
    }
    socket.on(evt, (data) => {
      console.log('New pickup:', data);
      callback?.(data);
    });
    registeredEvents.add(evt);
  },

  // Acknowledge actions (DEMO front-end emits)
  emitAccept: (pickupId) => {
    if (!socket) return;
    socket.emit('delivery-accept-demo', { pickupId });
  },
  emitReject: (pickupId) => {
    if (!socket) return;
    socket.emit('delivery-reject-demo', { pickupId });
  },

  // Listen for earnings update
  onEarningsUpdate: (callback) => {
    if (!socket) return;
    const evt = 'earnings-update';
    if (registeredEvents.has(evt)) {
      socket.removeAllListeners(evt);
    }
    socket.on(evt, (data) => {
      console.log('Earnings update:', data);
      callback?.(data);
    });
    registeredEvents.add(evt);
  },

  // Send notification to user
  sendNotification: (userId, notification) => {
    if (socket) {
      socket.emit('send-notification', { userId, notification });
    }
  },

  // Disconnect socket
  disconnect: () => {
    if (socket) {
      try { socket.removeAllListeners(); } catch {}
      try { socket.disconnect(); } catch {}
      socket = null;
      registeredEvents.clear();
      currentUserId = null;
    }
  },

  // Get socket instance
  getSocket: () => {
    return socket;
  }
};

export default notificationService;
