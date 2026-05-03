import React, { useState, useEffect } from 'react';
import { orderAPI, foodItemAPI, restaurantAPI } from '../services/api';
import { Utensils, CheckCircle, XCircle, DollarSign, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const STATUS_COLORS = {
    PLACED: 'badge-warning', ACCEPTED: 'badge-success', ASSIGNED: 'badge-info',
    PICKED_UP: 'badge-info', DELIVERED: 'badge-success', CANCELLED: 'badge-danger'
};

export default function RestaurantDashboard({ activeTab: initialTab }) {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [itemForm, setItemForm] = useState({ name: '', price: '' });
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(initialTab || 'orders');

    // Sync tab with prop from App.js routing
    useEffect(() => {
        if (initialTab) setActiveTab(initialTab);
    }, [initialTab]);

    useEffect(() => { 
        if (user?.id) loadRestaurantData(); 
    }, [user]);

    useEffect(() => { 
        if (restaurant) { 
            loadOrders(); 
            loadMenu(); 
            
            const interval = setInterval(() => {
                loadOrders();
            }, 10000); // Poll every 10 seconds
            
            return () => clearInterval(interval);
        } 
    }, [restaurant]);

    const loadRestaurantData = async () => {
        try {
            // Get restaurant linked to this user
            const res = await restaurantAPI.getByUserId(user.id);
            if (res.data) {
                setRestaurant(res.data);
            } else {
                setError('No restaurant profile found for this user.');
            }
        } catch (e) { 
            setError('Error loading restaurant profile.'); 
        }
    };

    const loadOrders = async () => {
        try {
            const res = await orderAPI.getByRestaurant(restaurant.restaurantId);
            setOrders(res.data);
        } catch (e) { setOrders([]); }
    };

    const loadMenu = async () => {
        try {
            const res = await foodItemAPI.getByRestaurant(restaurant.restaurantId);
            setMenu(res.data);
        } catch (e) { setMenu([]); }
    };

    const handleAccept = async (id) => {
        try { await orderAPI.accept(id); loadOrders(); } catch (e) { setError('Cannot accept order.'); }
    };

    const handleReject = async (id) => {
        try { await orderAPI.reject(id); loadOrders(); } catch (e) { setError('Cannot reject order.'); }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await foodItemAPI.add(restaurant.restaurantId, itemForm);
            loadMenu();
            setItemForm({ name: '', price: '' });
        } catch (e) { setError('Cannot add item.'); }
    };

    if (!restaurant && !error) return <div className="loading">Loading restaurant profile...</div>;

    const incomingOrders = orders.filter(o => o.status === 'PLACED');

    return (
        <div>
            <h1 className="page-title"><Utensils /> {restaurant?.name || 'Restaurant Dashboard'}</h1>
            {error && <div className="alert alert-error">{error}</div>}

            {/* Restaurant Stats */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}><Package size={24} /></div>
                    <div className="stat-content">
                        <span className="stat-value">{orders.length}</span>
                        <span className="stat-label">Total Orders</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><CheckCircle size={24} /></div>
                    <div className="stat-content">
                        <span className="stat-value">{orders.filter(o => o.status === 'DELIVERED').length}</span>
                        <span className="stat-label">Delivered</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><DollarSign size={24} /></div>
                    <div className="stat-content">
                        <span className="stat-value">${(orders.filter(o => o.status === 'DELIVERED').reduce((sum, o) => sum + (o.totalAmount || 25.50), 0)).toFixed(2)}</span>
                        <span className="stat-label">Revenue</span>
                    </div>
                </div>
            </div>

            {/* Local Tab Switcher (Optional since Sidebar handles it now) */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {['orders', 'menu'].map(t => (
                    <button key={t} onClick={() => setActiveTab(t)}
                        className={`btn ${activeTab === t ? 'btn-primary' : ''}`}
                        style={{ textTransform: 'capitalize', ...(activeTab !== t ? { background: 'var(--surface-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' } : {}) }}>
                        {t === 'orders' ? `📦 Orders ${incomingOrders.length > 0 ? `(${incomingOrders.length} new)` : ''}` : '🍽️ Menu'}
                    </button>
                ))}
            </div>

            {activeTab === 'orders' && (
                <>
                    {/* Incoming Orders */}
                    {incomingOrders.length > 0 && (
                        <div className="card" style={{ border: '2px solid var(--warning-btn)' }}>
                            <h3 className="card-title">🔔 New Orders — Action Required</h3>
                            {incomingOrders.map(o => (
                                <div key={o.orderId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--warning-bg)', borderRadius: '10px', marginBottom: '10px' }}>
                                    <div>
                                        <strong>Order #{o.orderId}</strong> — {o.customer?.name}
                                        {o.deliveryAddress && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>📍 {o.deliveryAddress}</div>}
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => handleAccept(o.orderId)} className="btn btn-success btn-sm"><CheckCircle size={14} /> Accept</button>
                                        <button onClick={() => handleReject(o.orderId)} className="btn btn-danger btn-sm"><XCircle size={14} /> Reject</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* All orders table */}
                    <div className="card table-wrapper">
                        <h3 className="card-title">Order History</h3>
                        <table>
                            <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Status</th><th>Delivery Partner</th></tr></thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o.orderId}>
                                        <td>#{o.orderId}</td>
                                        <td>{o.customer?.name}</td>
                                        <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{o.orderDate ? new Date(o.orderDate).toLocaleString() : '—'}</td>
                                        <td><span className={`badge ${STATUS_COLORS[o.status] || 'badge-info'}`}>{o.status}</span></td>
                                        <td>{o.deliveryPartner?.name || <span style={{ color: 'var(--text-secondary)' }}>Not assigned</span>}</td>
                                    </tr>
                                ))}
                                {orders.length === 0 && <tr><td colSpan="5" className="empty-state">No orders yet.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {activeTab === 'menu' && restaurant && (
                <div className="card">
                    <h3 className="card-title">Menu Management</h3>
                    <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ flex: 1 }}><label>Item Name</label><input placeholder="e.g. Margherita Pizza" value={itemForm.name} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} required /></div>
                        <div className="form-group" style={{ width: '120px' }}><label>Price ($)</label><input type="number" step="0.01" placeholder="9.99" value={itemForm.price} onChange={e => setItemForm({ ...itemForm, price: e.target.value })} required /></div>
                        <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>+ Add Item</button>
                    </form>
                    <table style={{ width: '100%' }}>
                        <thead><tr><th>Item</th><th>Price</th></tr></thead>
                        <tbody>
                            {menu.map(item => (
                                <tr key={item.itemId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '12px 0' }}>{item.name}</td>
                                    <td style={{ padding: '12px 0', fontWeight: 'bold' }}>${item.price}</td>
                                </tr>
                            ))}
                            {menu.length === 0 && <tr><td colSpan="2" className="empty-state">No menu items yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
