import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { adminUser, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return paths.map((path, index) => ({
      label: path.charAt(0).toUpperCase() + path.slice(1),
      path: '/' + paths.slice(0, index + 1).join('/'),
    }));
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-600">Admin Panel</h1>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' 
                    : 'text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-sm font-medium text-secondary-600 hover:bg-secondary-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-secondary-600">
            {getBreadcrumbs().map((crumb, index, array) => (
              <React.Fragment key={crumb.path}>
                <Link
                  to={crumb.path}
                  className={`hover:text-primary-600 ${
                    index === array.length - 1 ? 'text-primary-600 font-medium' : ''
                  }`}
                >
                  {crumb.label}
                </Link>
                {index < array.length - 1 && (
                  <ChevronRight className="w-4 h-4 mx-2" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* User info */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-secondary-900">
            {getBreadcrumbs().slice(-1)[0]?.label || 'Dashboard'}
          </h1>
          
          <div className="text-sm text-secondary-600">
            <span className="font-medium">{adminUser?.email}</span>
            <span className="mx-2">•</span>
            <span className="capitalize">{adminUser?.role}</span>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
};