import { io } from 'socket.io-client';
import getEnvVars from '../config';

const { API_BASE_URL } = getEnvVars();

// Initialize socket connection
let socket = null;

export const notificationService = {
  // Initialize socket connection
  init: (userId) => {
    if (socket) {
      socket.disconnect();
    }

    socket = io(API_BASE_URL.replace('/api', ''), {
      auth: {
        userId: userId
      }
    });

    socket.on('connect', () => {
      console.log('Connected to notification server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from notification server');
    });

    return socket;
  },

  // Join delivery room for pickup notifications
  joinDeliveryRoom: (deliveryId) => {
    if (socket) {
      socket.emit('join-delivery-room', deliveryId);
    }
  },

  // Join user room for general notifications
  joinUserRoom: (userId) => {
    if (socket) {
      socket.emit('join-user-room', userId);
    }
  },

  // Listen for pickup requests
  onPickupRequest: (callback) => {
    if (socket) {
      socket.on('pickup-request', (data) => {
        console.log('Pickup request received:', data);
        callback(data);
      });
    }
  },

  // Listen for pickup status updates
  onPickupStatusUpdate: (callback) => {
    if (socket) {
      socket.on('pickup-status-update', (data) => {
        console.log('Pickup status update:', data);
        callback(data);
      });
    }
  },

  // Listen for new pickup available
  onNewPickupAvailable: (callback) => {
    if (socket) {
      socket.on('new-pickup-available', (data) => {
        console.log('New pickup available:', data);
        callback(data);
      });
    }
  },

  // Listen for earnings update
  onEarningsUpdate: (callback) => {
    if (socket) {
      socket.on('earnings-update', (data) => {
        console.log('Earnings update:', data);
        callback(data);
      });
    }
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
      socket.disconnect();
      socket = null;
    }
  },

  // Get socket instance
  getSocket: () => {
    return socket;
  }
};

export default notificationService;
