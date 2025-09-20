import axios from 'axios';
import { dummyUsers, dummyWasteSubmissions, dummyCoupons } from './dummyData';


export const USE_DUMMY = true; // flip to false when backend ready
const api = axios.create({ baseURL: 'https://your-backend.example.com/api' });


export const authService = {
login: async (email, password) => {
if (USE_DUMMY) return { user: dummyUsers[0], token: 'dummy-token' };
const res = await api.post('/auth/login', { email, password });
return res.data;
}
};


export const userService = {
me: async (token) => {
if (USE_DUMMY) return dummyUsers[0];
const res = await api.get('/users/me', { headers: { Authorization: `Bearer ${token}` } });
return res.data;
}
};


export const wasteService = {
listForUser: async (userId) => {
if (USE_DUMMY) return dummyWasteSubmissions.filter(w => w.userId === userId);
const res = await api.get(`/waste/user/${userId}`);
return res.data;
},
submit: async (payload) => {
if (USE_DUMMY) {
const newItem = { id: 'w' + (Math.floor(Math.random()*10000)), ...payload, status: 'pending', date: new Date().toISOString().split('T')[0] };
dummyWasteSubmissions.unshift(newItem);
return newItem;
}
const res = await api.post('/waste/upload', payload);
return res.data;
}
};


export const couponService = {
listForUser: async (userId) => {
if (USE_DUMMY) return dummyCoupons.filter(c => c.userId === userId);
const res = await api.get(`/coupons/user/${userId}`);
return res.data;
},
redeem: async (couponId) => {
if (USE_DUMMY) {
const c = dummyCoupons.find(x => x.id === couponId);
if (c) c.redeemed = true;
return c;
}
const res = await api.post(`/coupons/redeem/${couponId}`);
return res.data;
}
};