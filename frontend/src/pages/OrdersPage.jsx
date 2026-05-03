import React, { useState, useEffect } from 'react';
import { orderAPI, customerAPI, restaurantAPI } from '../services/api';
import { Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const STATUS_OPTIONS = ['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
const STATUS_COLORS = { PENDING: 'badge-warning', PREPARING: 'badge-info', OUT_FOR_DELIVERY: 'badge-info', DELIVERED: 'badge-success', CANCELLED: 'badge-danger' };

export default function OrdersPage() {
    const { user, hasRole } = useAuth();
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [form, setForm] = useState({ customerId: '', restaurantId: '' });
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [pendingStatuses, setPendingStatuses] = useState({});

    const isAdmin = hasRole('ADMIN');

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const oRes = await orderAPI.getAll();
            setOrders(oRes.data);
            
            if (isAdmin) {
                const [cRes, rRes] = await Promise.all([customerAPI.getAll(), restaurantAPI.getAll()]);
                setCustomers(cRes.data); setRestaurants(rRes.data);
            }
            setError(null);
        } catch (e) {
            setError('Backend not available.');
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!isAdmin || !form.customerId || !form.restaurantId) return;
        try {
            await orderAPI.place(form.customerId, form.restaurantId, {});
            loadData();
        } catch (e) { setError('Could not place order.'); }
    };

    const handleStatusChange = (orderId, status) => {
        setPendingStatuses(prev => ({ ...prev, [orderId]: status }));
    };

    const handleUpdateStatus = async (orderId) => {
        const newStatus = pendingStatuses[orderId];
        if (!newStatus) return;
        setUpdatingId(orderId);
        try {
            await orderAPI.updateStatus(orderId, newStatus);
            loadData();
        } catch (e) {
            setError('Could not update status.');
        }
        setUpdatingId(null);
    };

    return (
        <div>
            <h2 className="page-title"><Calendar /> {isAdmin ? 'All Orders' : 'My Orders'}</h2>
            {error && <div className="alert alert-error">{error}</div>}

            {isAdmin && (
                <div className="card">
                    <h3 className="card-title">Place New Order (Admin Override)</h3>
                    <form onSubmit={handlePlaceOrder}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Customer</label>
                                <select value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })} required>
                                    <option value="">Select Customer</option>
                                    {customers.map(c => <option key={c.customerId} value={c.customerId}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Restaurant</label>
                                <select value={form.restaurantId} onChange={e => setForm({ ...form, restaurantId: e.target.value })} required>
                                    <option value="">Select Restaurant</option>
                                    {restaurants.map(r => <option key={r.restaurantId} value={r.restaurantId}>{r.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-warning">Place Order</button>
                    </form>
                </div>
            )}

            <div className="card table-wrapper">
                <h3 className="card-title">{isAdmin ? 'System Order History' : 'Recent Orders'}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>{isAdmin ? 'Customer' : 'Restaurant'}</th>
                            <th>Date</th>
                            <th>Status</th>
                            {isAdmin && <th>Update Status</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.orderId}>
                                <td>#{o.orderId}</td>
                                <td>{isAdmin ? o.customer?.name : o.restaurant?.name}</td>
                                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : '—'}</td>
                                <td><span className={`badge ${STATUS_COLORS[o.status] || 'badge-info'}`}>{o.status}</span></td>
                                {isAdmin && (
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <select
                                                value={pendingStatuses[o.orderId] || o.status}
                                                onChange={e => handleStatusChange(o.orderId, e.target.value)}
                                                style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <button
                                                onClick={() => handleUpdateStatus(o.orderId)}
                                                className="btn btn-primary btn-sm"
                                                disabled={updatingId === o.orderId}>
                                                {updatingId === o.orderId ? '...' : 'Update'}
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {orders.length === 0 && <tr><td colSpan={isAdmin ? 6 : 5} className="empty-state">No orders found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}