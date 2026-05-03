import React, { useState, useEffect } from 'react';
import { adminAPI, deliveryAPI } from '../services/api';
import { Users, ShoppingBag, Utensils, DollarSign, Package, Truck, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const STATUS_COLORS = {
    PLACED: 'badge-warning', ACCEPTED: 'badge-info', ASSIGNED: 'badge-info',
    PICKED_UP: 'badge-info', DELIVERED: 'badge-success', CANCELLED: 'badge-danger'
};

export default function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [orders, setOrders] = useState([]);
    const [partners, setPartners] = useState([]);
    const [newPartner, setNewPartner] = useState({ name: '', phone: '' });
    const [assignMap, setAssignMap] = useState({});
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [sRes, oRes, pRes] = await Promise.all([
                adminAPI.getStats(), adminAPI.getAllOrders(), adminAPI.getPartners()
            ]);
            setStats(sRes.data); setOrders(oRes.data); setPartners(pRes.data);
            setError(null);
        } catch (e) {
            setError('Backend not available. Start the Spring Boot server to see live data.');
        }
    };

    const handleAssign = async (orderId) => {
        const partnerId = assignMap[orderId];
        if (!partnerId) return;
        try { await adminAPI.assignPartner(orderId, partnerId); loadData(); }
        catch (e) { setError('Could not assign partner.'); }
    };

    const handleCreatePartner = async (e) => {
        e.preventDefault();
        try { await adminAPI.createPartner(newPartner); setNewPartner({ name: '', phone: '' }); loadData(); }
        catch (e) { setError('Could not create partner.'); }
    };

    const chartData = [
        { name: 'Placed', value: stats.pendingOrders || 0 },
        { name: 'Delivered', value: stats.deliveredOrders || 0 },
        { name: 'Active', value: stats.activeDeliveries || 0 },
    ];

    const tabs = ['overview', 'orders', 'partners'];

    return (
        <div>
            <h1 className="page-title">👑 Admin Dashboard</h1>
            {error && <div className="alert alert-error">{error}</div>}

            {/* Tab Nav */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {tabs.map(t => (
                    <button key={t} onClick={() => setActiveTab(t)}
                        className={`btn ${activeTab === t ? 'btn-primary' : ''}`}
                        style={{ textTransform: 'capitalize', ...(activeTab !== t ? { background: 'var(--surface-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' } : {}) }}>
                        {t}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <>
                    <div className="stats-grid">
                        {[
                            { icon: <Users size={24} />, value: stats.totalCustomers || 0, label: 'Customers' },
                            { icon: <Utensils size={24} />, value: stats.totalRestaurants || 0, label: 'Restaurants', color: '#10b981' },
                            { icon: <ShoppingBag size={24} />, value: stats.totalOrders || 0, label: 'Total Orders', color: '#f59e0b' },
                            { icon: <DollarSign size={24} />, value: `$${(stats.totalRevenue || 0).toFixed(2)}`, label: 'Revenue', color: '#ef4444' },
                            { icon: <Package size={24} />, value: stats.pendingOrders || 0, label: 'Pending', color: '#f59e0b' },
                            { icon: <Truck size={24} />, value: stats.activeDeliveries || 0, label: 'In Delivery', color: '#6366f1' },
                            { icon: <CheckCircle size={24} />, value: stats.deliveredOrders || 0, label: 'Delivered', color: '#10b981' },
                        ].map((s, i) => (
                            <div className="stat-card" key={i}>
                                <div className="stat-icon" style={s.color ? { background: `${s.color}20`, color: s.color } : {}}>
                                    {s.icon}
                                </div>
                                <div className="stat-content">
                                    <span className="stat-value">{s.value}</span>
                                    <span className="stat-label">{s.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="card">
                        <h3 className="card-title">Order Status Overview</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis dataKey="name" /><YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}

            {activeTab === 'orders' && (
                <div className="card table-wrapper">
                    <h3 className="card-title">All Orders — Assign Delivery Partner</h3>
                    <table>
                        <thead><tr><th>ID</th><th>Customer</th><th>Restaurant</th><th>Status</th><th>Partner</th><th>Assign</th></tr></thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.orderId}>
                                    <td>#{o.orderId}</td>
                                    <td>{o.customer?.name}</td>
                                    <td>{o.restaurant?.name}</td>
                                    <td><span className={`badge ${STATUS_COLORS[o.status] || 'badge-info'}`}>{o.status}</span></td>
                                    <td>{o.deliveryPartner?.name || <span style={{ color: 'var(--text-secondary)' }}>Unassigned</span>}</td>
                                    <td>
                                        {!o.deliveryPartner && (
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <select style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                                    value={assignMap[o.orderId] || ''}
                                                    onChange={e => setAssignMap(prev => ({ ...prev, [o.orderId]: e.target.value }))}>
                                                    <option value="">Select</option>
                                                    {partners.filter(p => p.available).map(p => (
                                                        <option key={p.partnerId} value={p.partnerId}>{p.name}</option>
                                                    ))}
                                                </select>
                                                <button onClick={() => handleAssign(o.orderId)} className="btn btn-primary btn-sm">Assign</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && <tr><td colSpan="6" className="empty-state">No orders yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'partners' && (
                <>
                    <div className="card">
                        <h3 className="card-title">Add Delivery Partner</h3>
                        <form onSubmit={handleCreatePartner}>
                            <div className="form-grid">
                                <div className="form-group"><label>Name</label><input placeholder="Name" value={newPartner.name} onChange={e => setNewPartner({ ...newPartner, name: e.target.value })} required /></div>
                                <div className="form-group"><label>Phone</label><input placeholder="Phone" value={newPartner.phone} onChange={e => setNewPartner({ ...newPartner, phone: e.target.value })} /></div>
                            </div>
                            <button type="submit" className="btn btn-primary">Add Partner</button>
                        </form>
                    </div>
                    <div className="card table-wrapper">
                        <h3 className="card-title">All Delivery Partners</h3>
                        <table>
                            <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Status</th><th>Total Earnings</th></tr></thead>
                            <tbody>
                                {partners.map(p => (
                                    <tr key={p.partnerId}>
                                        <td>#{p.partnerId}</td><td>{p.name}</td><td>{p.phone}</td>
                                        <td><span className={`badge ${p.available ? 'badge-success' : 'badge-warning'}`}>{p.available ? 'Available' : 'On Delivery'}</span></td>
                                        <td style={{ fontWeight: 'bold', color: 'var(--success-btn)' }}>${(p.totalEarnings || 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                                {partners.length === 0 && <tr><td colSpan="5" className="empty-state">No delivery partners yet.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
