import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Package } from 'lucide-react';
import './DashboardPage.css'; // Optional for extra styling

const DashboardPage = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
