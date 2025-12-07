import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchUser } from './store/authSlice';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin-dashboard');

  return (
    <>
      <Navbar />
      <CartDrawer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/admin-dashboard/*" 
          element={
            <ProtectedRoute requireStaff={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch user profile if access token exists
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="app">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
