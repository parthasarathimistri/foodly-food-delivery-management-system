import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import {
  Users, Calendar, CreditCard, LogOut,
  LayoutDashboard, ShoppingBag, Utensils, Menu, X, Moon, Sun, ShoppingCart, Tag, Truck, Home, MapPin
} from 'lucide-react';

import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import CustomerHome from './pages/CustomerHome';
import CartPage from './pages/CartPage';
import OrderTracking from './pages/OrderTracking';
import CustomersPage from './pages/CustomersPage';
import OrdersPage from './pages/OrdersPage';
import PaymentsPage from './pages/PaymentsPage';
import CouponsPage from './pages/CouponsPage';
import RestaurantsPage from './pages/RestaurantsPage';

import './App.css';

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function CartBadge() {
  const { getItemCount } = useCart();
  const count = getItemCount();
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <ShoppingCart size={18} /> Cart
      {count > 0 && (
        <span style={{ 
          marginLeft: 'auto', background: 'var(--primary-color)', color: 'white', 
          borderRadius: '50%', width: '22px', height: '22px', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' 
        }}>
          {count}
        </span>
      )}
    </span>
  );
}

function SidebarLink({ to, icon: Icon, label, end = false, onClick }) {
    const renderIcon = () => {
        if (!Icon) return null;
        if (React.isValidElement(Icon)) return Icon;
        if (typeof Icon === 'function' || (typeof Icon === 'object' && Icon.$$typeof)) {
            return <Icon size={20} />;
        }
        return null;
    };

    return (
        <NavLink to={to} end={end} className="nav-link" onClick={onClick}>
            {renderIcon()}
            <span>{label}</span>
        </NavLink>
    );
}

function AppContent() {
  const { user, logout, hasRole, isAuthenticated } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const closeMenu = () => setIsMobileMenuOpen(false);

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-logo"><ShoppingBag size={24} /></div>
            <span>Foodly</span>
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <nav className={`sidebar-nav ${isMobileMenuOpen ? 'open' : ''}`}>
            {/* ADMIN NAV */}
            {hasRole('ADMIN') && (
              <>
                <div className="nav-section-label">Admin Panel</div>
                <SidebarLink to="/admin" icon={LayoutDashboard} label="Dashboard" onClick={closeMenu} />
                <SidebarLink to="/admin/customers" icon={Users} label="Customers" onClick={closeMenu} />
                <SidebarLink to="/admin/restaurants" icon={Utensils} label="Restaurants" onClick={closeMenu} />
                <SidebarLink to="/admin/orders" icon={Calendar} label="All Orders" onClick={closeMenu} />
                <SidebarLink to="/admin/payments" icon={CreditCard} label="Payments" onClick={closeMenu} />
                <SidebarLink to="/admin/coupons" icon={Tag} label="Coupons" onClick={closeMenu} />
              </>
            )}

            {/* RESTAURANT NAV */}
            {hasRole('RESTAURANT') && (
              <>
                <div className="nav-section-label">Restaurant</div>
                <SidebarLink to="/restaurant" icon={LayoutDashboard} label="Kitchen Dashboard" onClick={closeMenu} />
                <SidebarLink to="/restaurant/menu" icon={Utensils} label="Menu Management" onClick={closeMenu} />
              </>
            )}

            {/* DELIVERY NAV */}
            {hasRole('DELIVERY') && (
              <>
                <div className="nav-section-label">Delivery</div>
                <SidebarLink to="/delivery" icon={Truck} label="Deliveries" onClick={closeMenu} />
                <SidebarLink to="/delivery/earnings" icon={CreditCard} label="Earnings" onClick={closeMenu} />
              </>
            )}

            {/* CUSTOMER NAV */}
            {hasRole('CUSTOMER') && (
              <>
                <div className="nav-section-label">Browse</div>
                <SidebarLink to="/" icon={Home} label="Home" end={true} onClick={closeMenu} />
                <SidebarLink to="/cart" icon={<CartBadge />} label="" onClick={closeMenu} />
                <SidebarLink to="/my-orders" icon={Calendar} label="My Orders" onClick={closeMenu} />
              </>
            )}

            <div className="mobile-logout">
              <button className="logout-btn" onClick={() => { logout(); closeMenu(); }}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          </nav>

          <div className="sidebar-footer desktop-logout">
            <button className="logout-btn" onClick={logout}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        <div className="main-wrapper">
          <header className="top-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                    background: 'var(--primary-color)', color: 'white', width: '36px', height: '36px', 
                    borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '1rem'
                }}>
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{user?.username}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user?.role}</div>
                </div>
            </div>
            <div className="header-actions">
              <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark Mode">
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
          </header>

          <main className="main-content">
            <Routes>
              {/* Default redirect based on role */}
              <Route path="/" element={
                hasRole('ADMIN') ? <Navigate to="/admin" replace /> :
                hasRole('RESTAURANT') ? <Navigate to="/restaurant" replace /> :
                hasRole('DELIVERY') ? <Navigate to="/delivery" replace /> :
                <CustomerHome />
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/customers" element={<ProtectedRoute roles={['ADMIN']}><CustomersPage /></ProtectedRoute>} />
              <Route path="/admin/restaurants" element={<ProtectedRoute roles={['ADMIN']}><RestaurantsPage /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute roles={['ADMIN']}><OrdersPage /></ProtectedRoute>} />
              <Route path="/admin/payments" element={<ProtectedRoute roles={['ADMIN']}><PaymentsPage /></ProtectedRoute>} />
              <Route path="/admin/coupons" element={<ProtectedRoute roles={['ADMIN']}><CouponsPage /></ProtectedRoute>} />

              {/* Restaurant Routes */}
              <Route path="/restaurant" element={<ProtectedRoute roles={['RESTAURANT']}><RestaurantDashboard activeTab="orders" /></ProtectedRoute>} />
              <Route path="/restaurant/menu" element={<ProtectedRoute roles={['RESTAURANT']}><RestaurantDashboard activeTab="menu" /></ProtectedRoute>} />

              {/* Delivery Routes */}
              <Route path="/delivery" element={<ProtectedRoute roles={['DELIVERY']}><DeliveryDashboard activeTab="deliveries" /></ProtectedRoute>} />
              <Route path="/delivery/earnings" element={<ProtectedRoute roles={['DELIVERY']}><DeliveryDashboard activeTab="earnings" /></ProtectedRoute>} />

              {/* Customer Routes */}
              <Route path="/cart" element={<ProtectedRoute roles={['CUSTOMER']}><CartPage /></ProtectedRoute>} />
              <Route path="/track/:orderId" element={<ProtectedRoute roles={['CUSTOMER']}><OrderTracking /></ProtectedRoute>} />
              <Route path="/my-orders" element={<ProtectedRoute roles={['CUSTOMER']}><OrdersPage /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
