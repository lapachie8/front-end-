import React from 'react';
import { Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const stats = [
    {
      label: 'Total Products',
      value: '124',
      icon: Package,
      change: '+12%',
      positive: true,
    },
    {
      label: 'Active Users',
      value: '847',
      icon: Users,
      change: '+18%',
      positive: true,
    },
    {
      label: 'Total Orders',
      value: '342',
      icon: ShoppingCart,
      change: '+24%',
      positive: true,
    },
    {
      label: 'Revenue',
      value: 'Rp 12.4M',
      icon: TrendingUp,
      change: '+8%',
      positive: true,
    },
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.positive ? 'text-success-600' : 'text-error-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-secondary-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-secondary-100 last:border-0">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-secondary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-900">
                    New order #{1000 + i}
                  </p>
                  <p className="text-xs text-secondary-600">
                    2 minutes ago
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-success-600">
                Rp {(Math.random() * 1000000).toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;