import React, { useState, useEffect, useRef } from 'react';
import { deliveryAPI } from '../services/api';
import { Truck, DollarSign, Package, MapPin } from 'lucide-react';
import TrackingMap from '../components/TrackingMap';
import { useAuth } from '../contexts/AuthContext';

const STATUS_COLORS = {
    PLACED: 'badge-warning', ACCEPTED: 'badge-success', ASSIGNED: 'badge-info',
    PICKED_UP: 'badge-info', DELIVERED: 'badge-success', CANCELLED: 'badge-danger'
};

// Bangalore coordinates as demo base
const BASE_LAT = 12.9716;
const BASE_LNG = 77.5946;

export default function DeliveryDashboard({ activeTab: initialTab }) {
    const { user } = useAuth();
    const [assignedOrders, setAssignedOrders] = useState([]);
    const [availableOrders, setAvailableOrders] = useState([]);
    const [partner, setPartner] = useState(null);
    const [activeOrder, setActiveOrder] = useState(null);
    const [deliveryPos, setDeliveryPos] = useState([BASE_LAT, BASE_LNG]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(initialTab || 'active');
    const simulationRef = useRef(null);

    // Sync tab with prop from App.js routing
    useEffect(() => {
        if (initialTab) {
            // Map 'earnings' tab to 'active' view but focus on stats
            if (initialTab === 'earnings') setActiveTab('active');
            else setActiveTab(initialTab);
        }
    }, [initialTab]);

    useEffect(() => {
        if (user?.id) loadPartnerData();
        return () => { if (simulationRef.current) clearInterval(simulationRef.current); };
    }, [user]);

    const loadPartnerData = async () => {
        try {
            // 1. Get partner profile linked to this user
            const pRes = await deliveryAPI.getByUserId(user.id);
            const p = pRes.data;
            setPartner(p);
            
            if (p) {
                setDeliveryPos([p.latitude || BASE_LAT, p.longitude || BASE_LNG]);
                
                // 2. Load assigned and available orders
                const [aRes, avRes] = await Promise.all([
                    deliveryAPI.getAssignedOrders(p.partnerId),
                    deliveryAPI.getAvailableOrders()
                ]);
                setAssignedOrders(aRes.data);
                setAvailableOrders(avRes.data);
            }
            setError(null);
        } catch (e) {
            setError('Error loading delivery profile. Backend might be unavailable.');
        }
    };

    const handleAcceptOrder = async (orderId) => {
        if (!partner) return;
        try {
            await deliveryAPI.acceptOrder(orderId, partner.partnerId);
            loadPartnerData();
        } catch (e) { setError('Cannot accept order.'); }
    };

    const handlePickup = async (orderId) => {
        try {
            await deliveryAPI.pickup(orderId);
            startSimulation();
            loadPartnerData();
        } catch (e) { setError('Cannot mark as picked up.'); }
    };

    const handleDeliver = async (orderId) => {
        try {
            await deliveryAPI.deliver(orderId);
            if (simulationRef.current) clearInterval(simulationRef.current);
            loadPartnerData();
        } catch (e) { setError('Cannot mark as delivered.'); }
    };

    const startSimulation = () => {
        let step = 0;
        const customerLat = BASE_LAT + 0.05;
        const customerLng = BASE_LNG + 0.05;
        simulationRef.current = setInterval(() => {
            step++;
            const t = Math.min(step * 0.05, 1);
            setDeliveryPos([
                BASE_LAT + (customerLat - BASE_LAT) * t,
                BASE_LNG + (customerLng - BASE_LNG) * t,
            ]);
            if (t >= 1) clearInterval(simulationRef.current);
        }, 2000);
    };

    if (!partner && !error) return <div className="loading">Loading delivery profile...</div>;

    const pickedUpOrder = assignedOrders.find(o => o.status === 'PICKED_UP');
    const restaurantPos = [BASE_LAT, BASE_LNG];
    const customerPos = [BASE_LAT + 0.05, BASE_LNG + 0.05];

    const todayEarnings = assignedOrders
        .filter(o => o.status === 'DELIVERED')
        .reduce((sum, o) => sum + (o.deliveryFee || 2.99), 0);

    return (
        <div>
            <h1 className="page-title"><Truck /> Delivery: {partner?.name || 'Partner Dashboard'}</h1>
            {error && <div className="alert alert-error">{error}</div>}

            {/* Stats Cards */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><DollarSign size={24} /></div>
                    <div className="stat-content">
                        <span className="stat-value">${todayEarnings.toFixed(2)}</span>
                        <span className="stat-label">Today's Earnings</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}><DollarSign size={24} /></div>
                    <div className="stat-content">
                        <span className="stat-value">${(partner?.totalEarnings || 0).toFixed(2)}</span>
                        <span className="stat-label">Total Lifetime Earnings</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}><Package size={24} /></div>
                    <div className="stat-content">
                        <span className="stat-value">{assignedOrders.filter(o => o.status === 'DELIVERED').length}</span>
                        <span className="stat-label">Deliveries Done</span>
                    </div>
                </div>
            </div>

            {/* Local Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {['active', 'available', 'map'].map(t => (
                    <button key={t} onClick={() => setActiveTab(t)}
                        className={`btn ${activeTab === t ? 'btn-primary' : ''}`}
                        style={{ textTransform: 'capitalize', ...(activeTab !== t ? { background: 'var(--surface-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' } : {}) }}>
                        {t === 'active' ? '📦 My Orders' : t === 'available' ? `🔍 Available (${availableOrders.length})` : '🗺️ Map'}
                    </button>
                ))}
            </div>

            {activeTab === 'active' && (
                <div className="card table-wrapper">
                    <h3 className="card-title">Assigned Orders</h3>
                    <table>
                        <thead><tr><th>Order</th><th>Customer</th><th>Restaurant</th><th>Status</th><th>Fee</th><th>Action</th></tr></thead>
                        <tbody>
                            {assignedOrders.map(o => (
                                <tr key={o.orderId}>
                                    <td>#{o.orderId}</td>
                                    <td>{o.customer?.name}</td>
                                    <td>{o.restaurant?.name}</td>
                                    <td><span className={`badge ${STATUS_COLORS[o.status] || 'badge-info'}`}>{o.status}</span></td>
                                    <td style={{ fontWeight: 'bold', color: 'var(--success-btn)' }}>${(o.deliveryFee || 2.99).toFixed(2)}</td>
                                    <td>
                                        {o.status === 'ASSIGNED' && (
                                            <button onClick={() => { handlePickup(o.orderId); setActiveOrder(o); setActiveTab('map'); }} className="btn btn-warning btn-sm">📦 Picked Up</button>
                                        )}
                                        {o.status === 'PICKED_UP' && (
                                            <button onClick={() => handleDeliver(o.orderId)} className="btn btn-success btn-sm">✅ Delivered</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {assignedOrders.length === 0 && <tr><td colSpan="6" className="empty-state">No assigned orders.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'available' && (
                <div className="card table-wrapper">
                    <h3 className="card-title">Available Orders — Pick one up!</h3>
                    <table>
                        <thead><tr><th>Order</th><th>Restaurant</th><th>Status</th><th>Fee</th><th>Accept</th></tr></thead>
                        <tbody>
                            {availableOrders.map(o => (
                                <tr key={o.orderId}>
                                    <td>#{o.orderId}</td>
                                    <td>{o.restaurant?.name}</td>
                                    <td><span className={`badge ${STATUS_COLORS[o.status] || 'badge-warning'}`}>{o.status}</span></td>
                                    <td style={{ fontWeight: 'bold', color: 'var(--success-btn)' }}>$2.99</td>
                                    <td><button onClick={() => handleAcceptOrder(o.orderId)} className="btn btn-primary btn-sm">Accept</button></td>
                                </tr>
                            ))}
                            {availableOrders.length === 0 && <tr><td colSpan="5" className="empty-state">No available orders nearby.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'map' && (
                <div className="card">
                    <h3 className="card-title"><MapPin /> Live Delivery Map</h3>
                    {pickedUpOrder ? (
                        <div style={{ marginBottom: '16px' }}>
                            <div className="alert alert-info" style={{ background: 'var(--info-bg)', color: 'var(--info-text)' }}>
                                🛵 Delivering Order #{pickedUpOrder.orderId} to {pickedUpOrder.customer?.name} — Est. {pickedUpOrder.estimatedDeliveryMinutes || 30} min
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-info" style={{ background: 'var(--info-bg)', color: 'var(--info-text)', marginBottom: '16px' }}>
                            📍 Showing demo route. Pick up an order to see live tracking.
                        </div>
                    )}
                    <div style={{ marginBottom: '12px', display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
                        <span>🔴 Restaurant (Pickup)</span>
                        <span>🔵 Customer (Dropoff)</span>
                        <span>🟢 You (Delivery Partner)</span>
                    </div>
                    <TrackingMap
                        restaurantPos={restaurantPos}
                        customerPos={customerPos}
                        deliveryPos={deliveryPos}
                        restaurantName={pickedUpOrder?.restaurant?.name || 'Restaurant'}
                        customerName={pickedUpOrder?.customer?.name || 'Customer'}
                    />
                </div>
            )}
        </div>
    );
}
