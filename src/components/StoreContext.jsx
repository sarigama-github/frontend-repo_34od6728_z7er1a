import React, { createContext, useContext, useMemo, useState } from 'react';

// Data models (mocked)
// user: { id, name, role: 'driver' | 'recipient', wallet_balance }
// order: { id, store_name, store_lat, store_lng, recipient_address, recipient_lat, recipient_lng, item_value, delivery_fee, status, proof_image_url, assigned_to }

const initialOrders = [
  {
    id: 'ORD-1001',
    store_name: 'FreshMart Grocery',
    store_lat: 37.7749,
    store_lng: -122.4194,
    recipient_address: '1220 Pine St, San Francisco',
    recipient_lat: 37.789,
    recipient_lng: -122.42,
    item_value: 42.5,
    delivery_fee: 5.0,
    status: 'available',
    proof_image_url: null,
    assigned_to: null,
  },
  {
    id: 'ORD-1002',
    store_name: 'Corner Pharmacy',
    store_lat: 37.7757,
    store_lng: -122.4312,
    recipient_address: '800 Market St, San Francisco',
    recipient_lat: 37.784,
    recipient_lng: -122.407,
    item_value: 28.0,
    delivery_fee: 4.0,
    status: 'available',
    proof_image_url: null,
    assigned_to: null,
  },
  {
    id: 'ORD-1003',
    store_name: 'City Electronics',
    store_lat: 37.768,
    store_lng: -122.41,
    recipient_address: '55 2nd St, San Francisco',
    recipient_lat: 37.7892,
    recipient_lng: -122.401,
    item_value: 120.0,
    delivery_fee: 8.0,
    status: 'available',
    proof_image_url: null,
    assigned_to: null,
  },
];

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState(initialOrders);
  const [mockLocation] = useState({ lat: 37.776, lng: -122.418 }); // Mock current location

  const login = (name, role) => {
    const newUser = { id: 'USR-1', name: name || 'Alex', role, wallet_balance: 75.0 };
    setUser(newUser);
  };

  const logout = () => setUser(null);

  const availableOrders = useMemo(() => orders.filter(o => o.status === 'available'), [orders]);
  const activeOrder = useMemo(() => orders.find(o => o.status === 'in_progress' && o.assigned_to === user?.id) || null, [orders, user]);

  const acceptOrder = (orderId) => {
    if (!user) return { ok: false, message: 'Not logged in' };
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return { ok: false, message: 'Order not found' };
    const order = orders[idx];
    if (order.status !== 'available') return { ok: false, message: 'Order not available' };

    const holdAmount = order.item_value;
    if (user.wallet_balance < holdAmount) {
      return { ok: false, message: 'Insufficient balance for hold' };
    }

    const updatedUser = { ...user, wallet_balance: +(user.wallet_balance - holdAmount).toFixed(2) };
    const updatedOrder = { ...order, status: 'in_progress', assigned_to: user.id };

    const newOrders = [...orders];
    newOrders[idx] = updatedOrder;
    setOrders(newOrders);
    setUser(updatedUser);

    return { ok: true, holdAmount };
  };

  const completeDelivery = (orderId, proofUrl) => {
    if (!user) return { ok: false, message: 'Not logged in' };
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return { ok: false, message: 'Order not found' };
    const order = orders[idx];
    if (order.status !== 'in_progress' || order.assigned_to !== user.id) {
      return { ok: false, message: 'Order not active' };
    }

    const holdAmount = order.item_value;
    const reward = order.delivery_fee;

    const updatedUser = {
      ...user,
      wallet_balance: +(user.wallet_balance + holdAmount + reward).toFixed(2),
    };

    const updatedOrder = { ...order, status: 'delivered', proof_image_url: proofUrl };
    const newOrders = [...orders];
    newOrders[idx] = updatedOrder;
    setOrders(newOrders);
    setUser(updatedUser);

    return { ok: true, released: holdAmount, reward };
  };

  const value = {
    user,
    orders,
    mockLocation,
    login,
    logout,
    availableOrders,
    activeOrder,
    acceptOrder,
    completeDelivery,
  };
  
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
