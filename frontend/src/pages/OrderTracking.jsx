import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI, deliveryAPI } from '../services/api';
import { Package, Truck, CheckCircle, MapPin, Clock, ArrowLeft } from 'lucide-react';
import TrackingMap from '../components/TrackingMap';

const STATUS_STEPS = [
    { key: 'PLACED', label: 'Order Placed', icon: <Package size={20} />, desc: 'We have received your order' },
    { key: 'ACCEPTED', label: 'Confirmed', icon: <CheckCircle size={20} />, desc: 'Restaurant is preparing your food' },
    { key: 'ASSIGNED', label: 'Partner Assigned', icon: <Truck size={20} />, desc: 'Delivery partner is on the way to restaurant' },
    { key: 'PICKED_UP', label: 'Out for Delivery', icon: <Truck size={20} />, desc: 'Food is on the way to your doorstep' },
    { key: 'DELIVERED', label: 'Delivered', icon: <CheckCircle size={20} />, desc: 'Enjoy your meal!' },
];

export default function OrderTracking() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deliveryPos, setDeliveryPos] = useState(null);
    const pollingRef = useRef(null);

    // Mock positions for demo
    const restaurantPos = [12.9716, 77.5946];
    const customerPos = [12.9916, 77.6146];

    useEffect(() => {
        loadOrder();
        pollingRef.current = setInterval(loadOrder, 5000);
        return () => clearInterval(pollingRef.current);
    }, [orderId]);

    const loadOrder = async () => {
        try {
            const res = await orderAPI.getById(orderId);
            const orderData = res.data;
            setOrder(orderData);
            
            // If order is picked up, simulate delivery partner moving
            if (orderData.status === 'PICKED_UP' || orderData.status === 'ASSIGNED') {
                if (orderData.deliveryPartner) {
                    setDeliveryPos([
                        orderData.deliveryPartner.latitude || restaurantPos[0],
                        orderData.deliveryPartner.longitude || restaurantPos[1]
                    ]);
                } else {
                    setDeliveryPos(restaurantPos);
                }
            } else if (orderData.status === 'DELIVERED') {
                setDeliveryPos(customerPos);
            }
            
            setLoading(false);
        } catch (e) {
            setError('Could not track order. Please check again later.');
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Initializing tracking...</div>;
    if (error || !order) return (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <h2 style={{ marginBottom: '16px' }}>Order Not Found</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error || 'The order you are looking for does not exist.'}</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Go Back Home</button>
        </div>
    );

    const currentStatusIndex = STATUS_STEPS.findIndex(s => s.key === order.status);

    return (
        <div className="order-tracking">
            <button className="btn btn-outline" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => navigate('/')}>
                <ArrowLeft size={18} /> Back to Home
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px', alignItems: 'start' }}>
                {/* Status Section */}
                <div className="card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Order #{order.orderId}</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>From {order.restaurant?.name}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                                <Clock size={20} /> {order.estimatedDeliveryMinutes || 30} mins
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Estimated Arrival</p>
                        </div>
                    </div>

                    <div className="tracking-stepper" style={{ position: 'relative' }}>
                        {STATUS_STEPS.map((step, index) => {
                            const isCompleted = index < currentStatusIndex;
                            const isCurrent = index === currentStatusIndex;
                            const isUpcoming = index > currentStatusIndex;

                            return (
                                <div key={step.key} style={{ display: 'flex', gap: '20px', marginBottom: '32px', position: 'relative' }}>
                                    {index !== STATUS_STEPS.length - 1 && (
                                        <div style={{
                                            position: 'absolute', left: '19px', top: '40px', bottom: '-20px', width: '2px',
                                            background: isCompleted ? 'var(--primary-color)' : 'var(--border-color)'
                                        }} />
                                    )}
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: isCompleted || isCurrent ? 'var(--primary-color)' : 'var(--surface-color)',
                                        color: isCompleted || isCurrent ? 'white' : 'var(--text-secondary)',
                                        border: isUpcoming ? '2px solid var(--border-color)' : 'none',
                                        zIndex: 1
                                    }}>
                                        {step.icon}
                                    </div>
                                    <div style={{ opacity: isUpcoming ? 0.5 : 1 }}>
                                        <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>{step.label}</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{step.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Map Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px' }}>
                        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MapPin size={20} /> Live Location
                        </h3>
                        <TrackingMap 
                            restaurantPos={restaurantPos}
                            customerPos={customerPos}
                            deliveryPos={deliveryPos}
                            restaurantName={order.restaurant?.name}
                            customerName={order.customer?.name}
                        />
                    </div>

                    {order.deliveryPartner && (
                        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--sidebar-active-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                                <Truck size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery Partner</div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{order.deliveryPartner.name}</div>
                            </div>
                            <a href={`tel:${order.deliveryPartner.phone}`} className="btn btn-sm btn-outline">Call</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
