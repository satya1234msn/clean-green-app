export const dummyUsers = [
{
id: 'u1',
name: 'Satya',
email: 'satya@example.com',
phone: '9876543210',
points: 120,
totalWaste: 15,
rewards: ['COUPON50ZOMATO', 'SWIGGY20OFF'],
impact: { co2Saved: 30, trees: 2, landfill: 12 }
},
{
id: 'u2',
name: 'Priya',
email: 'priya@example.com',
phone: '9123456780',
points: 80,
totalWaste: 9,
rewards: ['ZOMATO10FREE'],
impact: { co2Saved: 18, trees: 1, landfill: 7 }
}
];


export const dummyWasteSubmissions = [
{
id: 'w1',
userId: 'u1',
image: 'https://dummyimage.com/400x300/00c897/fff&text=Plastic+Bottle',
weight: 2.5,
status: 'approved',
pickup: 'p1',
date: '2025-09-01'
},
{
id: 'w2',
userId: 'u2',
image: 'https://dummyimage.com/400x300/006c67/fff&text=Plastic+Bag',
weight: 1.2,
status: 'pending',
pickup: 'p2',
date: '2025-09-10'
}
];


export const dummyCoupons = [
{ id: 'c1', userId: 'u1', partner: 'Zomato', code: 'COUPON50ZOMATO', expiry: '2025-12-31', redeemed: false },
{ id: 'c2', userId: 'u1', partner: 'Swiggy', code: 'SWIGGY20OFF', expiry: '2025-11-30', redeemed: false },
{ id: 'c3', userId: 'u2', partner: 'Zomato', code: 'ZOMATO10FREE', expiry: '2025-10-15', redeemed: true }
];