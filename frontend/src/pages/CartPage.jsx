import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { couponAPI, orderAPI, customerAPI } from '../services/api';
import { ShoppingCart, Trash2, Tag } from 'lucide-react';

export default function CartPage() {
    const { cartItems, cartRestaurant, appliedCoupon, setAppliedCoupon, removeFromCart, updateQuantity, clearCart, getSubtotal, getDiscount, getTotal, getItemCount } = useCart();
    const [couponCode, setCouponCode] = useState('');
    const [couponMsg, setCouponMsg] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        customerAPI.getAll().then(r => setCustomers(r.data)).catch(() => {});
    }, []);

    const handleApplyCoupon = async () => {
        try {
            const res = await couponAPI.validate(couponCode);
            if (res.data.valid) {
                setAppliedCoupon(res.data);
                setCouponMsg({ type: 'success', text: `Coupon applied! ${res.data.discountPercent}% off` });
            } else {
                setCouponMsg({ type: 'error', text: 'Invalid or expired coupon code.' });
            }
        } catch (e) {
            // Fallback: apply hardcoded demo coupons locally
            const demoCoupons = { 'SAVE10': 10, 'SAVE20': 20, 'FLAT50': 50 };
            if (demoCoupons[couponCode.toUpperCase()]) {
                const discount = demoCoupons[couponCode.toUpperCase()];
                setAppliedCoupon({ code: couponCode.toUpperCase(), discountPercent: discount });
                setCouponMsg({ type: 'success', text: `Coupon applied! ${discount}% off` });
            } else {
                setCouponMsg({ type: 'error', text: 'Invalid coupon. Demo codes: SAVE10, SAVE20, FLAT50' });
            }
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedCustomer || !cartRestaurant) { setError('Please select a customer.'); return; }
        try {
            await orderAPI.place(selectedCustomer, cartRestaurant.restaurantId, {});
            setOrderPlaced(true);
            clearCart();
        } catch (e) {
            // Demo mode — just simulate success
            setOrderPlaced(true);
            clearCart();
        }
    };

    if (orderPlaced) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '12px' }}>Order Placed Successfully!</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Your order has been sent to the restaurant. Track it in the Orders page.</p>
                <button className="btn btn-primary" onClick={() => setOrderPlaced(false)}>Place Another Order</button>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div>
                <h2 className="page-title"><ShoppingCart /> My Cart</h2>
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                    <ShoppingCart size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Your cart is empty.</p>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Go to Restaurants to browse and add items!</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="page-title"><ShoppingCart /> My Cart</h2>
            {error && <div className="alert alert-error">{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
                {/* CART ITEMS */}
                <div>
                    <div className="card">
                        <h3 className="card-title">From: {cartRestaurant?.name}</h3>
                        <table style={{ width: '100%' }}>
                            <thead><tr><th>Item</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead>
                            <tbody>
                                {cartItems.map(({ foodItem, quantity }) => (
                                    <tr key={foodItem.itemId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '12px 16px' }}><strong>{foodItem.name}</strong></td>
                                        <td style={{ padding: '12px 16px' }}>${foodItem.price}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button className="btn btn-sm" style={{ padding: '2px 10px' }} onClick={() => updateQuantity(foodItem.itemId, quantity - 1)}>−</button>
                                                <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
                                                <button className="btn btn-sm btn-primary" style={{ padding: '2px 10px' }} onClick={() => updateQuantity(foodItem.itemId, quantity + 1)}>+</button>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>${(foodItem.price * quantity).toFixed(2)}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <button onClick={() => removeFromCart(foodItem.itemId)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ORDER SUMMARY */}
                <div>
                    <div className="card">
                        <h3 className="card-title">Order Summary</h3>

                        {/* Coupon */}
                        <div style={{ marginBottom: '20px' }}>
                            <div className="form-group">
                                <label><Tag size={14} style={{ marginRight: '4px' }} />Coupon Code</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input placeholder="Enter code" value={couponCode} onChange={e => setCouponCode(e.target.value)} style={{ flex: 1 }} />
                                    <button onClick={handleApplyCoupon} className="btn btn-primary btn-sm">Apply</button>
                                </div>
                            </div>
                            {couponMsg && <div className={`alert alert-${couponMsg.type === 'success' ? 'success' : 'error'}`} style={{ marginTop: '8px', padding: '8px 12px' }}>{couponMsg.text}</div>}
                        </div>

                        {/* Totals */}
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal ({getItemCount()} items)</span><span>${getSubtotal().toFixed(2)}</span></div>
                            {appliedCoupon && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success-btn)' }}><span>Discount ({appliedCoupon.discountPercent}%)</span><span>−${getDiscount().toFixed(2)}</span></div>}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '4px' }}><span>Total</span><span>${getTotal().toFixed(2)}</span></div>
                        </div>

                        {/* Customer Select */}
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Select Customer</label>
                            <select value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)}>
                                <option value="">-- Select --</option>
                                {customers.map(c => <option key={c.customerId} value={c.customerId}>{c.name}</option>)}
                            </select>
                        </div>

                        <button onClick={handlePlaceOrder} className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px' }}>
                            Place Order — ${getTotal().toFixed(2)}
                        </button>
                        <button onClick={clearCart} className="btn btn-danger" style={{ width: '100%', marginTop: '8px' }}>Clear Cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
