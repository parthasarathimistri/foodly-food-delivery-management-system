import React, { useState, useEffect } from 'react';
import { couponAPI } from '../services/api';
import { Tag } from 'lucide-react';

export default function CouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [form, setForm] = useState({ code: '', discountPercent: '' });
    const [error, setError] = useState(null);

    useEffect(() => { loadCoupons(); }, []);

    const loadCoupons = async () => {
        try {
            const res = await couponAPI.getAll();
            setCoupons(res.data);
            setError(null);
        } catch (e) {
            setError('Backend not available. Demo coupons: SAVE10 (10%), SAVE20 (20%), FLAT50 (50%)');
            // Show demo data
            setCoupons([
                { couponId: 1, code: 'SAVE10', discountPercent: 10, active: true },
                { couponId: 2, code: 'SAVE20', discountPercent: 20, active: true },
                { couponId: 3, code: 'FLAT50', discountPercent: 50, active: true },
            ]);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await couponAPI.create({ code: form.code.toUpperCase(), discountPercent: parseFloat(form.discountPercent), active: true });
            loadCoupons();
            setForm({ code: '', discountPercent: '' });
        } catch (e) {
            setError('Could not create coupon. Backend not available.');
        }
    };

    const handleDeactivate = async (id) => {
        try {
            await couponAPI.deactivate(id);
            loadCoupons();
        } catch (e) {
            setCoupons(prev => prev.map(c => c.couponId === id ? { ...c, active: false } : c));
        }
    };

    return (
        <div>
            <h2 className="page-title"><Tag /> Coupons & Discounts</h2>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="card">
                <h3 className="card-title">Create New Coupon</h3>
                <form onSubmit={handleCreate}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Coupon Code</label>
                            <input placeholder="e.g. SUMMER20" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Discount (%)</label>
                            <input placeholder="e.g. 20" type="number" min="1" max="100" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: e.target.value })} required />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Create Coupon</button>
                </form>
            </div>

            <div className="card table-wrapper">
                <h3 className="card-title">Active Coupons</h3>
                <table>
                    <thead><tr><th>Code</th><th>Discount</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {coupons.map(c => (
                            <tr key={c.couponId}>
                                <td><strong style={{ fontFamily: 'monospace', background: 'var(--sidebar-active-bg)', padding: '4px 8px', borderRadius: '4px' }}>{c.code}</strong></td>
                                <td style={{ fontWeight: 'bold', color: 'var(--success-btn)' }}>{c.discountPercent}% off</td>
                                <td><span className={`badge ${c.active ? 'badge-success' : 'badge-danger'}`}>{c.active ? 'Active' : 'Inactive'}</span></td>
                                <td>
                                    {c.active && <button onClick={() => handleDeactivate(c.couponId)} className="btn btn-warning btn-sm">Deactivate</button>}
                                </td>
                            </tr>
                        ))}
                        {coupons.length === 0 && <tr><td colSpan="4" className="empty-state">No coupons yet.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
