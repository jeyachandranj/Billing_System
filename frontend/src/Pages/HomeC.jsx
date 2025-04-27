import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddProduct from './Add Product/AddProduct';
import axios from 'axios';
import './Home.css';

// Import icons for sidebar
import { 
  FaTachometerAlt, 
  FaBoxOpen, 
  FaFileInvoiceDollar, 
  FaHistory, 
  FaCog, 
  FaSignOutAlt, 
  FaUserCircle,
  FaBars,
  FaTimes
} from 'react-icons/fa';

// Component Pages
const Dashboard = () => (
  <div className="dashboard-container">
    <h2>Dashboard</h2>
    <div className="dashboard-stats">
      <div className="stat-card">
        <h3>Total Products</h3>
        <p className="stat-value">145</p>
      </div>
      <div className="stat-card">
        <h3>Monthly Sales</h3>
        <p className="stat-value">$12,456</p>
      </div>
      <div className="stat-card">
        <h3>Pending Orders</h3>
        <p className="stat-value">24</p>
      </div>
      <div className="stat-card">
        <h3>Customer Rating</h3>
        <p className="stat-value">4.8/5</p>
      </div>
    </div>
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      <ul>
        <li>New product added: Cotton Thread</li>
        <li>Order #45678 processed and shipped</li>
        <li>Customer inquiry from John D. resolved</li>
        <li>Inventory updated: 10 new products added</li>
      </ul>
    </div>
  </div>
);


const Billing = () => (
  <div className="content-container">
    <h2>Billing</h2>
    <p>Manage your invoices and payment information here.</p>
    <div className="billing-summary">
      <h3>Current Billing Cycle</h3>
      <p>Outstanding: $1,250.00</p>
      <p>Due Date: May 15, 2025</p>
      <button className="btn-primary">Generate Invoice</button>
    </div>
  </div>
);

const History = () => (
  <div className="content-container">
    <h2>Transaction History</h2>
    <div className="transaction-list">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2025-04-12</td>
            <td>#ORD-5673</td>
            <td>James Wilson</td>
            <td>$145.99</td>
            <td><span className="status completed">Completed</span></td>
          </tr>
          <tr>
            <td>2025-04-10</td>
            <td>#ORD-5672</td>
            <td>Sofia Garcia</td>
            <td>$89.50</td>
            <td><span className="status completed">Completed</span></td>
          </tr>
          <tr>
            <td>2025-04-08</td>
            <td>#ORD-5671</td>
            <td>Michael Brown</td>
            <td>$235.00</td>
            <td><span className="status pending">Pending</span></td>
          </tr>
          <tr>
            <td>2025-04-05</td>
            <td>#ORD-5670</td>
            <td>Emily Johnson</td>
            <td>$78.25</td>
            <td><span className="status completed">Completed</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const Settings = () => (
  <div className="content-container">
    <h2>Settings</h2>
    <div className="settings-section">
      <h3>Account Settings</h3>
      <form>
        <div className="form-group">
          <label>Email Notifications</label>
          <div className="toggle-switch">
            <input type="checkbox" id="email-toggle" defaultChecked />
            <label htmlFor="email-toggle"></label>
          </div>
        </div>
        <div className="form-group">
          <label>Two-Factor Authentication</label>
          <div className="toggle-switch">
            <input type="checkbox" id="2fa-toggle" />
            <label htmlFor="2fa-toggle"></label>
          </div>
        </div>
        <div className="form-group">
          <label>Theme</label>
          <select defaultValue="light">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System Default</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">Save Changes</button>
      </form>
    </div>
  </div>
);

function HomeEmp() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const handleLogout = () => {
    // Handle logout logic here
    navigate('/');
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'addProduct':
        return <AddProduct />;
      case 'billing':
        return <Billing />;
      case 'history':
        return <History />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };
  
  return (
    <div className="home-container">
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <h2>Admin Portal</h2>
          </div>
          <button className="toggle-sidebar" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        
        <div className="user-info">
          <FaUserCircle className="user-avatar" />
          <span className="user-name">{name}</span>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li 
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveTab('dashboard')}
            >
              <FaTachometerAlt />
              <span>Dashboard</span>
            </li>
            <li 
              className={activeTab === 'addProduct' ? 'active' : ''}
              onClick={() => setActiveTab('addProduct')}
            >
              <FaBoxOpen />
              <span>Add Order</span>
            </li>
            <li 
              className={activeTab === 'billing' ? 'active' : ''}
              onClick={() => setActiveTab('billing')}
            >
              <FaFileInvoiceDollar />
              <span>Billing</span>
            </li>
            <li 
              className={activeTab === 'history' ? 'active' : ''}
              onClick={() => setActiveTab('history')}
            >
              <FaHistory />
              <span>History</span>
            </li>
            <li 
              className={activeTab === 'settings' ? 'active' : ''}
              onClick={() => setActiveTab('settings')}
            >
              <FaCog />
              <span>Settings</span>
            </li>
            <li onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </li>
          </ul>
        </nav>
      </div>
      
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="content-header">
          <h1>Welcome, {name}!</h1>
          <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className="content-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default HomeEmp;