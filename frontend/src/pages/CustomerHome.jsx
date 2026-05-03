import React, { useState, useEffect } from 'react';
import { restaurantAPI, foodItemAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { Utensils, Star, Clock, ShoppingCart, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerHome() {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addedItem, setAddedItem] = useState(null);
    const { addToCart, getItemCount } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        loadRestaurants();
    }, []);

    const loadRestaurants = async () => {
        setLoading(true);
        try {
            const res = await restaurantAPI.getAll();
            setRestaurants(res.data);
        } catch (e) {
            setError('Could not load restaurants. Backend might be offline.');
        }
        setLoading(false);
    };

    const loadMenu = async (r) => {
        setSelectedRestaurant(r);
        try {
            const res = await foodItemAPI.getByRestaurant(r.restaurantId);
            setMenu(res.data);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
            setMenu([]);
        }
    };

    const handleAddToCart = (item) => {
        addToCart(item, selectedRestaurant);
        setAddedItem(item.itemId);
        setTimeout(() => setAddedItem(null), 1000);
    };

    if (loading) return <div className="loading">Loading restaurants...</div>;

    return (
        <div className="customer-home">
            <header className="customer-header" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    Hungry? <span style={{ color: 'var(--primary-color)' }}>Order Now.</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Discover the best food from top restaurants near you.</p>
            </header>

            {error && <div className="alert alert-error">{error}</div>}

            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {/* Restaurant Grid */}
                <div style={{ flex: '2', minWidth: '400px' }}>
                    <h2 className="section-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Utensils size={24} /> Popular Restaurants
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {restaurants.map(r => (
                            <div 
                                key={r.restaurantId} 
                                className={`restaurant-card ${selectedRestaurant?.restaurantId === r.restaurantId ? 'active' : ''}`}
                                onClick={() => loadMenu(r)}
                                style={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, border-color 0.2s',
                                    border: selectedRestaurant?.restaurantId === r.restaurantId ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    background: 'var(--surface-color)',
                                    padding: '20px'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{r.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                        <Star size={14} fill="#92400e" /> {r.rating || '4.5'}
                                    </div>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{r.cuisine || 'Fast Food • Indian • Chinese'}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> 25-35 min</span>
                                    <span>•</span>
                                    <span>$2.99 Delivery</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Menu Panel */}
                {selectedRestaurant && (
                    <div style={{ flex: '1', minWidth: '350px', position: 'sticky', top: '100px' }}>
                        <div className="card" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 className="card-title" style={{ margin: 0 }}>{selectedRestaurant.name} Menu</h3>
                                <button className="btn btn-sm btn-outline" onClick={() => setSelectedRestaurant(null)}>Close</button>
                            </div>
                            
                            <div className="menu-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {menu.map(item => (
                                    <div key={item.itemId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.name}</div>
                                            <div style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>${item.price}</div>
                                        </div>
                                        <button 
                                            className={`btn btn-sm ${addedItem === item.itemId ? 'btn-success' : 'btn-primary'}`}
                                            onClick={() => handleAddToCart(item)}
                                            style={{ borderRadius: '12px' }}
                                        >
                                            {addedItem === item.itemId ? <Check size={16} /> : <Plus size={16} />}
                                        </button>
                                    </div>
                                ))}
                                {menu.length === 0 && <div className="empty-state">No items available in the menu yet.</div>}
                            </div>

                            {getItemCount() > 0 && (
                                <button 
                                    className="btn btn-primary" 
                                    style={{ width: '100%', marginTop: '24px', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                                    onClick={() => navigate('/cart')}
                                >
                                    <ShoppingCart size={20} /> View Cart ({getItemCount()})
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
