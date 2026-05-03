import React, { useState, useEffect } from 'react';
import { customerAPI } from '../services/api';
import { Users } from 'lucide-react';

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
    const [error, setError] = useState(null);

    useEffect(() => { loadCustomers(); }, []);

    const loadCustomers = async () => {
        try {
            const res = await customerAPI.getAll();
            setCustomers(res.data);
            setError(null);
        } catch (e) {
            setError('Backend not available. Please start the Spring Boot server.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await customerAPI.add(form);
            loadCustomers();
            setForm({ name: '', email: '', phone: '', address: '' });
        } catch (e) {
            setError('Could not add customer. Backend not available.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await customerAPI.delete(id);
            loadCustomers();
        } catch (e) {
            setError('Could not delete customer. Backend not available.');
        }
    };

    return (
        <div>
            <h2 className="page-title"><Users /> Customers</h2>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="card">
                <h3 className="card-title">Add New Customer</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Name</label>
                            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Add Customer</button>
                </form>
            </div>

            <div className="card table-wrapper">
                <h3 className="card-title">Customer List</h3>
                <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Actions</th></tr></thead>
                    <tbody>
                        {customers.map(c => (
                            <tr key={c.customerId}>
                                <td>{c.name}</td>
                                <td>{c.email}</td>
                                <td>{c.phone}</td>
                                <td>{c.address}</td>
                                <td><button onClick={() => handleDelete(c.customerId)} className="btn btn-danger btn-sm">Delete</button></td>
                            </tr>
                        ))}
                        {customers.length === 0 && (
                            <tr><td colSpan="5" className="empty-state">No customers found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}