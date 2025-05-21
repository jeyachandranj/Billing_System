import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './BillingPage.css';
import html2pdf from 'html2pdf.js';

const BillingPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const invoiceRef = useRef();
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/orders');
        setOrders(res.data);
        setFilteredOrders(res.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);
  
  // Apply filters
  useEffect(() => {
    let result = [...orders];
    
    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    // Date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      result = result.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === filterDate.toDateString();
      });
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        (order.orderId && order.orderId.toLowerCase().includes(query)) ||
        (order.customerName && order.customerName.toLowerCase().includes(query))
      );
    }
    
    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [statusFilter, dateFilter, searchQuery, orders]);

  const handleDownloadPDF = () => {
    const element = invoiceRef.current;
  
    const opt = {
      margin: 0.5,
      filename: `${selectedOrder.orderId || 'invoice'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { avoid: 'tr' }
    };
    
    html2pdf().set(opt).from(element).save();
  };
  
  const handleStatusChange = (id, newStatus) => {
    setOrders(prev =>
      prev.map(order => order._id === id ? { ...order, status: newStatus } : order)
    );
  };

  const handleSaveStatus = async (order) => {
    try {
      await axios.put(`http://localhost:3000/api/orders/${order.orderId}`, {
        status: order.status,
      });
      alert('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleCreateInvoice = async (order) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/orders/${order._id}`);
      setSelectedOrder(response.data);
      setShowInvoice(true);
      document.body.style.overflow = 'hidden';
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to load order details for invoice');
    }
  };

  const handleCloseInvoice = () => {
    setSelectedOrder(null);
    setShowInvoice(false);
    document.body.style.overflow = 'auto';
  };
  
  const resetFilters = () => {
    setStatusFilter('all');
    setDateFilter('');
    setSearchQuery('');
  };
  
  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  
  // Calculate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredOrders.length / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  if (isLoading) {
    return <div className="loading">Loading orders</div>;
  }

  return (
    <div className="billing-container">
      
      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Date:</label>
          <input 
            type="date" 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Search:</label>
          <input 
            type="text" 
            placeholder="Order ID or Customer" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <button onClick={resetFilters}>Reset Filters</button>
        </div>
      </div>
      
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total (₹)</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map(order => (
                <tr key={order._id}>
                  <td>{order.orderId || order._id.substring(0, 8)}</td>
                  <td>{order.customerName}</td>
                  <td>{Number(order.totalAmount || 0).toFixed(2)}</td>
                  <td>
                    {editMode ? (
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    {editMode ? (
                      <button 
                        className="action-btn save-btn"
                        onClick={() => handleSaveStatus(order)}
                      >
                        Save
                      </button>
                    ) : (
                      <button 
                        className="action-btn invoice-btn"
                        onClick={() => handleCreateInvoice(order)}
                      >
                        Create Invoice
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-orders">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredOrders.length > ordersPerPage && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          
          {pageNumbers.map(number => (
            <button
              key={number}
              className={currentPage === number ? 'active' : ''}
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </button>
          ))}
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageNumbers.length))}
            disabled={currentPage === pageNumbers.length}
          >
            &raquo;
          </button>
        </div>
      )}

      <div className="action-bar">
        <button 
          className={`edit-mode-btn ${editMode ? 'active' : ''}`}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Exit Edit Mode' : 'Edit Statuses'}
        </button>
      </div>

      {/* Invoice Modal */}
      {showInvoice && selectedOrder && (
        <div className="invoice-modal-overlay">
          <div className="invoice-modal-content">
            <button 
              className="close-modal-button" 
              onClick={handleCloseInvoice}
              aria-label="Close invoice"
            >
              &times;
            </button>
            
            <div ref={invoiceRef} className="invoice-document">
              <div className="quote-header">
                <h2 className="quote-title">INVOICE</h2>
                <div className="quote-meta">
                  <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  <p><strong>Invoice #:</strong> {selectedOrder.orderId || selectedOrder._id}</p>
                  <p><strong>Customer ID:</strong> {selectedOrder.customerId || 'N/A'}</p>
                  <p><strong>Valid Until:</strong> {new Date(
                    new Date(selectedOrder.createdAt).setMonth(
                      new Date(selectedOrder.createdAt).getMonth() + 1
                    )
                  ).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="company-info">
                <h3>Karuparayan Cotton Mill</h3>
                <p>8/134, Sillangadu, Nsdupatti, Uthukuli, Tamil Nadu</p>
                <p>Website: https://kc-mills.netlify.app/</p>
                <p>Phone: 9786300829</p>
                <p>Email: sddeepak512@gmail.com</p>
                <p>GSTIN/UIN: 33CLMPD7076A1ZC</p>
              </div>

              <div className="customer-info">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                <p><strong>Address:</strong> {selectedOrder.customerAddress || 'Not provided'}</p>
                <p><strong>Phone:</strong> {selectedOrder.customerPhone || 'Not provided'}</p>
              </div>

              <table className="quote-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Unit Price (₹)</th>
                    <th>Qty</th>
                    <th>Tax</th>
                    <th>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{Number(item.price).toFixed(2)}</td>
                      <td>{item.count}</td>
                      <td>18%</td>
                      <td>{Number(item.price * item.count).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="quote-summary">
                <p><strong>Subtotal:</strong> ₹{Number(selectedOrder.totalAmount).toFixed(2)}</p>
                <p><strong>GST (18%):</strong> ₹{Number(selectedOrder.items?.reduce((a, b) => a + b.price * b.count, 0) * 0.18).toFixed(2)}</p>
                <p className="quote-total"><strong>Total Amount:</strong> ₹{Number(Number(selectedOrder.totalAmount) + selectedOrder.items?.reduce((a, b) => a + b.price * b.count, 0) * 0.18).toFixed(2)}</p>
              </div>

              <div className="terms">
                <h4>Terms and Conditions</h4>
                <ol>
                  <li>Payment is due within 15 days from the date of invoice.</li>
                  <li>Goods once sold will not be taken back or exchanged.</li>
                  <li>All disputes are subject to Tamil Nadu jurisdiction only.</li>
                </ol>
                
                <p className="footer-note">
                  Thank You For Your Business!
                </p>
              </div>
            </div>
            
            <div className="invoice-actions">
              <button className="download-btn" onClick={handleDownloadPDF}>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;