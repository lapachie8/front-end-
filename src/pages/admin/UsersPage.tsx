import React from 'react';
import { Users as UsersIcon } from 'lucide-react';

const UsersPage: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
          <UsersIcon className="w-8 h-8 text-primary-600" />
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-2">Users Management</h2>
      <p className="text-secondary-600 mb-4">
        This feature is coming soon. Stay tuned!
      </p>
    </div>
  );
};

export default UsersPage;