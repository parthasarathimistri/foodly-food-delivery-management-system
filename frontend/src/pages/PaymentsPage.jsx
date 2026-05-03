import React, { useState, useEffect } from 'react';
import { paymentAPI, orderAPI } from '../services/api';
import { CreditCard } from 'lucide-react';

export default function PaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [form, setForm] = useState({ orderId: '', amount: '' });
    const [error, setError] = useState(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [pRes, oRes] = await Promise.all([
                paymentAPI.getAll(),
                orderAPI.getAll()
            ]);
            setPayments(pRes.data);
            setOrders(oRes.data.filter(o => o.status !== 'PAID'));
            setError(null);
        } catch (e) {
            setError('Backend not available. Please start the Spring Boot server.');
        }
    };

    const handleProcessPayment = async (e) => {
        e.preventDefault();
        if (!form.orderId || !form.amount) return;
        try {
            await paymentAPI.process(form.orderId, form.amount);
            loadData();
            setForm({ orderId: '', amount: '' });
        } catch (e) {
            setError('Could not process payment. Backend not available.');
        }
    };

    return (
        <div>
            <h2 className="page-title"><CreditCard /> Payments</h2>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="card">
                <h3 className="card-title">Process Payment</h3>
                <form onSubmit={handleProcessPayment}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Pending Order</label>
                            <select value={form.orderId} onChange={e => setForm({ ...form, orderId: e.target.value })} required>
                                <option value="">Select Pending Order</option>
                                {orders.map(o => <option key={o.orderId} value={o.orderId}>Order #{o.orderId} - {o.customer?.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Amount ($)</label>
                            <input placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} type="number" step="0.01" required />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success">Process Payment</button>
                </form>
            </div>

            <div className="card table-wrapper">
                <h3 className="card-title">Payment History</h3>
                <table>
                    <thead><tr><th>Payment ID</th><th>Order ID</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                        {payments.map(p => (
                            <tr key={p.paymentId}>
                                <td>#{p.paymentId}</td>
                                <td>#{p.order?.orderId}</td>
                                <td style={{ fontWeight: 'bold', color: 'var(--success-btn)' }}>${p.amount}</td>
                                <td><span className="badge badge-success">{p.paymentStatus}</span></td>
                            </tr>
                        ))}
                        {payments.length === 0 && (
                            <tr><td colSpan="4" className="empty-state">No payments found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}