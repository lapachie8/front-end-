import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './components/admin/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/admin/LoginPage';
import PersonalInfoPage from './pages/checkout/PersonalInfoPage';
import PaymentPage from './pages/checkout/PaymentPage';
import ShippingPage from './pages/checkout/ShippingPage';
import ConfirmationPage from './pages/checkout/ConfirmationPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/ProductsPage';
import AdminUsersPage from './pages/admin/UsersPage';
import AdminSettingsPage from './pages/admin/SettingsPage';

// Route Guards
const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('user');
  return isAuthenticated ? element : <Navigate to="/login\" state={{ from: window.location.pathname }} />;
};

const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAdmin = !!localStorage.getItem('adminUser');
  return isAdmin ? element : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <OrderProvider>
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminRoute element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />} />
                <Route path="/admin/dashboard" element={<AdminRoute element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />} />
                <Route path="/admin/products" element={<AdminRoute element={<AdminLayout><AdminProductsPage /></AdminLayout>} />} />
                <Route path="/admin/users" element={<AdminRoute element={<AdminLayout><AdminUsersPage /></AdminLayout>} />} />
                <Route path="/admin/settings" element={<AdminRoute element={<AdminLayout><AdminSettingsPage /></AdminLayout>} />} />

                {/* Public Routes */}
                <Route
                  path="/"
                  element={
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-grow">
                        <HomePage />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-grow">
                        <ProductsPage />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/product/:id"
                  element={
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-grow">
                        <ProductDetailPage />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-grow">
                        <CartPage />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-grow">
                        <LoginPage />
                      </main>
                      <Footer />
                    </div>
                  }
                />

                {/* Protected Checkout Routes */}
                <Route
                  path="/checkout/personal-info"
                  element={
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-grow">
                        <PrivateRoute element={<PersonalInfoPage />} />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/checkout/payment"
                  element={
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-grow">
                        <PrivateRoute element={<PaymentPage />} />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/checkout/shipping"
                  element={
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-grow">
                        <PrivateRoute element={<ShippingPage />} />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/checkout/confirmation"
                  element={
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-grow">
                        <PrivateRoute element={<ConfirmationPage />} />
                      </main>
                      <Footer />
                    </div>
                  }
                />
              </Routes>

              <Toaster position="top-right" />
            </OrderProvider>
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;