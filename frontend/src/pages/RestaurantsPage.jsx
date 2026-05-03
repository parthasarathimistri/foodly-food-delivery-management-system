import React, { useState, useEffect } from 'react';
import { restaurantAPI, foodItemAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { Utensils, ShoppingCart, Plus } from 'lucide-react';

export default function RestaurantsPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [form, setForm] = useState({ name: '', cuisine: '', rating: '' });
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [itemForm, setItemForm] = useState({ name: '', price: '' });
    const [error, setError] = useState(null);
    const [addedItem, setAddedItem] = useState(null);
    const { addToCart, getItemCount } = useCart();

    useEffect(() => { loadRestaurants(); }, []);

    const loadRestaurants = async () => {
        try {
            const res = await restaurantAPI.getAll();
            setRestaurants(res.data);
            setError(null);
        } catch (e) {
            setError('Backend not available. Please start the Spring Boot server.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await restaurantAPI.add(form);
            loadRestaurants();
            setForm({ name: '', cuisine: '', rating: '' });
        } catch (e) { setError('Could not add restaurant.'); }
    };

    const handleDelete = async (id) => {
        try { await restaurantAPI.delete(id); loadRestaurants(); }
        catch (e) { setError('Could not delete restaurant.'); }
    };

    const loadMenu = async (r) => {
        try {
            setSelectedRestaurant(r);
            const res = await foodItemAPI.getByRestaurant(r.restaurantId);
            setMenu(res.data);
        } catch (e) { setMenu([]); }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await foodItemAPI.add(selectedRestaurant.restaurantId, itemForm);
            loadMenu(selectedRestaurant);
            setItemForm({ name: '', price: '' });
        } catch (e) { setError('Could not add item.'); }
    };

    const handleAddToCart = (item) => {
        addToCart(item, selectedRestaurant);
        setAddedItem(item.itemId);
        setTimeout(() => setAddedItem(null), 1500);
    };

    return (
        <div>
            <h2 className="page-title"><Utensils /> Restaurants</h2>
            {error && <div className="alert alert-error">{error}</div>}

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {/* LEFT PANEL */}
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <div className="card">
                        <h3 className="card-title">Add Restaurant</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group"><label>Name</label><input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                                <div className="form-group"><label>Cuisine</label><input placeholder="Cuisine" value={form.cuisine} onChange={e => setForm({ ...form, cuisine: e.target.value })} /></div>
                                <div className="form-group"><label>Rating (1-5)</label><input placeholder="Rating" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} type="number" step="0.1" /></div>
                            </div>
                            <button type="submit" className="btn btn-success">Add Restaurant</button>
                        </form>
                    </div>

                    <div className="card">
                        <h3 className="card-title">Restaurant List</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {restaurants.map(r => (
                                <div key={r.restaurantId}
                                    style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: selectedRestaurant?.restaurantId === r.restaurantId ? 'var(--sidebar-active-bg)' : 'var(--surface-color)', transition: 'all 0.2s' }}
                                    onClick={() => loadMenu(r)}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{r.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{r.cuisine} &nbsp;|&nbsp; ⭐ {r.rating}</div>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(r.restaurantId); }} className="btn btn-danger btn-sm">Delete</button>
                                </div>
                            ))}
                            {restaurants.length === 0 && <div className="empty-state">No restaurants found.</div>}
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL — MENU */}
                {selectedRestaurant && (
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <div className="card">
                            <h3 className="card-title">{selectedRestaurant.name} — Menu</h3>
                            <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'flex-end' }}>
                                <div className="form-group" style={{ flex: 1 }}><label>Item Name</label><input placeholder="Name" value={itemForm.name} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} required /></div>
                                <div className="form-group" style={{ width: '100px' }}><label>Price ($)</label><input placeholder="Price" value={itemForm.price} onChange={e => setItemForm({ ...itemForm, price: e.target.value })} type="number" step="0.01" required /></div>
                                <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>Add</button>
                            </form>
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    {menu.map(item => (
                                        <tr key={item.itemId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '12px 0' }}><strong>{item.name}</strong></td>
                                            <td style={{ padding: '12px 0', fontWeight: 'bold' }}>${item.price}</td>
                                            <td style={{ padding: '12px 0', textAlign: 'right' }}>
                                                <button
                                                    onClick={() => handleAddToCart(item)}
                                                    className="btn btn-primary btn-sm"
                                                    style={{ background: addedItem === item.itemId ? 'var(--success-btn)' : undefined }}>
                                                    {addedItem === item.itemId ? '✓ Added' : <><Plus size={14} /> Add to Cart</>}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {menu.length === 0 && <tr><td colSpan="3" className="empty-state">No items in menu.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}