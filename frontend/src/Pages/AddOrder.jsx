import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./AddOrder.css";

const AddOrder = () => {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Added phone number state
  const [totalAmount, setTotalAmount] = useState(0);
  const [lastOrderId, setLastOrderId] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get('https://billing-system-f37s.onrender.com/api/goods');
        setProducts(productsResponse.data);
        const ordersResponse = await axios.get('https://billing-system-f37s.onrender.com/api/orders/last');
        if (ordersResponse.data && ordersResponse.data.orderId) {
          const lastId = parseInt(ordersResponse.data.orderId.split('-')[1]) || 0;
          setLastOrderId(lastId);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const generateOrderId = () => {
    const nextId = lastOrderId + 1;
    return `KCM-${nextId.toString().padStart(4, '0')}`;
  };

  const handleAddItem = async () => {
    const product = products.find((p) => p._id === selectedProduct);
    if (product) {
      if (quantity > product.quantity) {
        alert(
          `Requested quantity (${quantity}) is greater than available stock (${product.quantity}). Goods may take more time to arrive.`
        );
        const shortageMessage = {
          productId: product._id,
          productName: product.name,
          requestedQuantity: quantity,
          availableQuantity: product.quantity,
          message: `Customer requested ${quantity}, but only ${product.quantity} available.`,
          timestamp: new Date(),
        };
        try {
          await axios.post('https://billing-system-f37s.onrender.com/api/shortage', shortageMessage);
          console.log('Shortage message sent to backend');
        } catch (error) {
          console.error('Failed to send shortage message:', error);
        }
      }
      
      const item = {
        productId: product._id,
        name: product.name,
        price: product.price,
        count: quantity,
        total: product.price * quantity,
      };
      setOrderItems([...orderItems, item]);
      setTotalAmount((prevTotal) => prevTotal + item.total);
      
      // Reset the form after adding
      setSelectedProduct('');
      setQuantity(1);
    }
  };

  const handleSubmitOrder = async () => {
    const orderId = generateOrderId();
    const order = {
      orderId,
      customerName,
      status: 'Pending',
      totalAmount,
      items: orderItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        count: item.count
      })),
      createdAt: new Date(),
      // Note: phoneNumber is NOT included here, so it won't be sent to the backend
    };
    try {
      const response = await axios.post('https://billing-system-f37s.onrender.com/api/orders', order);
      console.log('Order created:', response.data);
      alert(`Order created successfully! Order ID: ${orderId}`);
      setLastOrderId(prev => prev + 1);
      setCustomerName('');
      setPhoneNumber(''); // Reset phone number too
      setOrderItems([]);
      setTotalAmount(0);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  // Validate phone number input (optional)
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Only allow digits and limit to 10 characters
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  // Calculate subtotal, tax and shipping for display purposes
  const subtotal = totalAmount;
  const tax = Math.round(subtotal * 0.18); // Assuming 18% GST
  const grandTotal = subtotal + tax;

  return (
    <div className="add-order-container">
      <div className="order-box">
        {/* Left side - Order Form */}
        <div className="order-form-section">
          <div className="company-brand">
            <div className="company-logo">KCM</div>
            <div>
              <h2>Create New Order</h2>
              <span className="company-name">Karupparayan Cotton Mills</span>
            </div>
          </div>
          
          <div className="order-id-preview">
            Order ID: {generateOrderId()}
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="no-border-form">
            <div className="form-group">
              <label htmlFor="customerName">Customer Name</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                placeholder="Enter customer name"
              />
            </div>

            {/* New Phone Number Field */}
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="Enter phone number"
                maxLength="10"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="product">Select Product</label>
              <select
                id="product"
                name="product"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                required
              >
                <option value="">Choose a product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} - ₹{product.price}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <div className="quantity-input-wrapper">
                <button type="button" className="quantity-btn" onClick={decrementQuantity}>-</button>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  className="quantity-input"
                  value={quantity}
                  min="1"
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setQuantity(val >= 1 ? val : 1);
                  }}
                  required
                />
                <button type="button" className="quantity-btn" onClick={incrementQuantity}>+</button>
              </div>
            </div>
            
            <div className="action-buttons">
              <button type="button" className="btn btn-secondary" onClick={handleAddItem}>
                Add to Order
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSubmitOrder}>
                Submit Order
              </button>
            </div>
          </form>
        </div>
        
        {/* Right side - Order Summary */}
        <div className="order-summary-section">
          <div className="summary-header">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-count">{orderItems.length}</div>
          </div>
          
          <div className="order-items">
            {orderItems.length > 0 ? (
              orderItems.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-details">₹{item.price} × {item.count}</span>
                  </div>
                  <span className="item-price">₹{item.total}</span>
                </div>
              ))
            ) : (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <p>No items added yet</p>
              </div>
            )}
          </div>
          
          <div className="total-section">
            <div className="total-row">
              <span className="total-label">Subtotal</span>
              <span className="total-value">₹{subtotal}</span>
            </div>
            <div className="total-row">
              <span className="total-label">GST (18%)</span>
              <span className="total-value">₹{tax}</span>
            </div>
            <div className="grand-total">
              <span className="grand-total-label">Total Amount</span>
              <span className="grand-total-value">₹{grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrder;