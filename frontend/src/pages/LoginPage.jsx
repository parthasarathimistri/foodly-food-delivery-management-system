import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Shield, Utensils, Truck, User } from 'lucide-react';

function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await login(credentials.username, credentials.password);
    
    if (result.success) {
      setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
      // Redirect based on role returned from backend
      setTimeout(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        switch(user?.role) {
          case 'ADMIN': navigate('/admin'); break;
          case 'RESTAURANT': navigate('/restaurant'); break;
          case 'DELIVERY': navigate('/delivery'); break;
          case 'CUSTOMER': navigate('/'); break;
          default: navigate('/');
        }
      }, 800);
    } else {
      setMessage({ text: result.message || 'Login failed. Please check your credentials.', type: 'error' });
    }
    setLoading(false);
  };

  const roles = [
    { value: 'ADMIN', label: 'Admin', icon: <Shield size={24} />, desc: 'System Control' },
    { value: 'RESTAURANT', label: 'Restaurant', icon: <Utensils size={24} />, desc: 'Manage Menu' },
    { value: 'DELIVERY', label: 'Delivery', icon: <Truck size={24} />, desc: 'Deliver Orders' },
    { value: 'CUSTOMER', label: 'Customer', icon: <User size={24} />, desc: 'Order Food' },
  ];

  return (
    <div className="login-container" style={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '20px'
    }}>
      <div className="login-card" style={{ 
        maxWidth: '550px', width: '100%', background: 'white', borderRadius: '24px', 
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)', padding: '48px'
      }}>
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '20px', background: 'var(--primary-color)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            color: 'white', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)'
          }}>
            <ShoppingBag size={32} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>Food Delivery</h1>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>Select your role and login to continue</p>
        </div>

        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '24px' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Role Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {roles.map(r => (
              <div key={r.value}
                onClick={() => setSelectedRole(r.value)}
                style={{
                  padding: '16px', borderRadius: '16px', cursor: 'pointer', textAlign: 'center',
                  border: `2px solid ${selectedRole === r.value ? 'var(--primary-color)' : '#f3f4f6'}`,
                  background: selectedRole === r.value ? 'rgba(99, 102, 241, 0.05)' : '#f9fafb',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px'
                }}>
                <div style={{ 
                  color: selectedRole === r.value ? 'var(--primary-color)' : '#9ca3af',
                  transition: 'color 0.2s'
                }}>
                  {r.icon}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#1f2937' }}>{r.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Username</label>
              <input type="text" value={credentials.username} onChange={e => setCredentials({ ...credentials, username: e.target.value })} placeholder="admin / restaurant / delivery / user" style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #d1d5db' }} required />
            </div>

            <div className="form-group">
              <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Password</label>
              <input type="password" value={credentials.password} onChange={e => setCredentials({ ...credentials, password: e.target.value })} placeholder="••••••••" style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #d1d5db' }} required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ 
            width: '100%', padding: '16px', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '16px',
            marginTop: '8px', boxShadow: '0 10px 15px rgba(99, 102, 241, 0.2)'
          }}>
            {loading ? 'Authenticating...' : `Login as ${selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', color: '#9ca3af', fontSize: '0.9rem' }}>
          Don't have an account? <span style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600' }}>Contact Admin</span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;