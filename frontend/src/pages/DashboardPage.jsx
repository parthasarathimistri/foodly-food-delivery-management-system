import React, { useState, useEffect } from 'react';
import { Utensils, Users, ShoppingBag, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { customerAPI, restaurantAPI, orderAPI, paymentAPI } from '../services/api';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export default function DashboardPage() {
    const [stats, setStats] = useState({ customers: 0, restaurants: 0, orders: 0, revenue: 0 });
    const [orderStatusData, setOrderStatusData] = useState([]);
    const [restaurantOrderData, setRestaurantOrderData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadStats(); }, []);

    const loadStats = async () => {
        setLoading(true);
        try {
            const [cRes, rRes, oRes, pRes] = await Promise.all([
                customerAPI.getAll(), restaurantAPI.getAll(), orderAPI.getAll(), paymentAPI.getAll()
            ]);
            const customers = cRes.data;
            const restaurants = rRes.data;
            const orders = oRes.data;
            const payments = pRes.data;

            const revenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
            setStats({ customers: customers.length, restaurants: restaurants.length, orders: orders.length, revenue: revenue.toFixed(2) });

            // Order status breakdown for Pie chart
            const statusMap = {};
            orders.forEach(o => { statusMap[o.status] = (statusMap[o.status] || 0) + 1; });
            setOrderStatusData(Object.entries(statusMap).map(([name, value]) => ({ name, value })));

            // Orders per restaurant for Bar chart
            const restMap = {};
            orders.forEach(o => {
                const name = o.restaurant?.name || 'Unknown';
                restMap[name] = (restMap[name] || 0) + 1;
            });
            setRestaurantOrderData(Object.entries(restMap).slice(0, 7).map(([name, orders]) => ({ name, orders })));

            // Revenue over time for Line chart (group by date)
            const revMap = {};
            payments.forEach(p => {
                const date = p.paymentDate ? p.paymentDate.substring(0, 10) : 'Unknown';
                revMap[date] = (revMap[date] || 0) + (p.amount || 0);
            });
            setRevenueData(Object.entries(revMap).sort().slice(-7).map(([date, revenue]) => ({ date, revenue: parseFloat(revenue.toFixed(2)) })));
        } catch (e) {
            // backend unavailable — keep zeros
        }
        setLoading(false);
    };

    return (
        <div>
            <h1 className="page-title">Analytics Dashboard</h1>

            {/* STAT CARDS */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon"><Users size={24} /></div>
                    <div className="stat-content">
                        <span className="stat-value">{loading ? '...' : stats.customers}</span>
                        <span className="stat-label">Total Customers</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><Utensils size={24} /></div>
                    <div className="stat-content">
                        <span className="stat-value">{loading ? '...' : stats.restaurants}</span>
                        <span className="stat-label">Restaurants</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}><ShoppingBag size={24} /></div>
                    <div className="stat-content">
                        <span className="stat-value">{loading ? '...' : stats.orders}</span>
                        <span className="stat-label">Total Orders</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><DollarSign size={24} /></div>
                    <div className="stat-content">
                        <span className="stat-value">{loading ? '...' : `$${stats.revenue}`}</span>
                        <span className="stat-label">Total Revenue</span>
                    </div>
                </div>
            </div>

            {/* CHARTS ROW 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div className="card">
                    <h3 className="card-title">Orders per Restaurant</h3>
                    {restaurantOrderData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={restaurantOrderData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="orders" fill="#6366f1" radius={[4,4,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-state">No order data yet. Start the backend to see live charts.</div>
                    )}
                </div>

                <div className="card">
                    <h3 className="card-title">Order Status Breakdown</h3>
                    {orderStatusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-state">No order data yet.</div>
                    )}
                </div>
            </div>

            {/* CHARTS ROW 2 */}
            <div className="card">
                <h3 className="card-title">Revenue Over Time</h3>
                {revenueData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis />
                            <Tooltip formatter={(v) => `$${v}`} />
                            <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="empty-state">No payment data yet. Revenue chart will populate once orders are paid.</div>
                )}
            </div>
        </div>
    );
}