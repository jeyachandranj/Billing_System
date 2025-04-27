import { Link, useLocation } from "react-router-dom";
import React from 'react';
import { 
  FileText, 
  Pen, 
  BarChart2, 
  Settings, 
  LogOut,
  File,
  Clock,
  CheckCircle,
  AlertTriangle,
  SquareActivity
} from 'lucide-react';

const Sidebar = ({ waitingCount, completedCount, draftsCount, pendingCount, handleLogout }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Function to determine if a link is active
  const isActive = (path) => currentPath === path;
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-blue-600 text-xl font-bold">SignTusk</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          <li>
            <Link 
              to="/dashboard" 
              className={`flex items-center px-3 py-2 rounded-md font-medium ${
                isActive('/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart2 className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/documents" 
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive('/documents') ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-5 h-5 mr-3" />
              Documents
            </Link>
          </li>
          <li>
            <Link 
              to="/activity" 
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive('/activity') ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <SquareActivity className="w-5 h-5 mr-3" />
              Activities
            </Link>
          </li>
        </ul>
        
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Status
          </h3>
          <ul className="mt-2 space-y-1">
            <li>
              <Link 
                to="/pending" 
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive('/pending') ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Clock className="w-5 h-5 mr-3 text-yellow-500" />
                Pending
                <span className="ml-auto bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">
                  {waitingCount}
                </span>
              </Link>
            </li>
            <li>
              <Link 
                to="/completed" 
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive('/completed') ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                Completed
                <span className="ml-auto bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                  {completedCount}
                </span>
              </Link>
            </li>
            <li>
              <Link 
                to="/drafts" 
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive('/drafts') ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <File className="w-5 h-5 mr-3 text-blue-500" />
                Drafts
                <span className="ml-auto bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                  {draftsCount}
                </span>
              </Link>
            </li>
            <li>
              <Link 
                to="/expired" 
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive('/expired') ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <AlertTriangle className="w-5 h-5 mr-3 text-red-500" />
                Expired
                <span className="ml-auto bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
                  {pendingCount}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <Link to="/settings" className="flex items-center text-gray-700 hover:text-gray-900">
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </Link>
        <button 
          onClick={handleLogout} 
          className="flex items-center text-gray-700 hover:text-gray-900 mt-4"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;