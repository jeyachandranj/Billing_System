import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./AddOrder.css"
const AddOrder = () => {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [lastOrderId, setLastOrderId] = useState(0);

  // Fetch products and last order ID on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await axios.get('http://localhost:3000/api/goods');
        setProducts(productsResponse.data);

        // Fetch last order ID
        const ordersResponse = await axios.get('http://localhost:3000/api/orders/last');
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
    return `KCM-${nextId.toString().padStart(4, '0')}`; // Format as KCM-0001, KCM-0002, etc.
  };

  const handleAddItem = () => {
    const product = products.find((p) => p._id === selectedProduct);
    if (product) {
      const item = {
        productId: product._id,
        name: product.name,
        price: product.price,
        count: quantity,
        total: product.price * quantity
      };

      setOrderItems([...orderItems, item]);
      setTotalAmount(prevTotal => prevTotal + item.total);
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
        price:item.price,
        count: item.count
      })),

      createdAt: new Date(),
    };

    try {
      const response = await axios.post('http://localhost:3000/api/orders', order);
      console.log('Order created:', response.data);
      alert(`Order created successfully! Order ID: ${orderId}`);
      
      // Update last order ID
      setLastOrderId(prev => prev + 1);
      
      // Reset form
      setCustomerName('');
      setOrderItems([]);
      setTotalAmount(0);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  return (
   
    <div className="add-order-container">
      <h2>Create New Order - Karupparayan Cotton Mills</h2>
      <div className="order-id-preview">
        Next Order ID: {generateOrderId()}
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
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

        <div className="form-group">
          <label htmlFor="product">Product</label>
          <select
            id="product"
            name="product"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            required
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            min="1"
            max={products.find((product) => product._id === selectedProduct)?.quantity || 0}
            onChange={(e) => setQuantity(Math.min(e.target.value, products.find((product) => product._id === selectedProduct)?.quantity))}
            required
          />
        </div>

        <button type="button" onClick={handleAddItem}>
          Add Item
        </button>

        <div className="order-items">
          {orderItems.map((item, index) => (
            <div key={index} className="order-item">
              <span>{item.name} - {item.price} x {item.count} = {item.total}</span>
            </div>
          ))}
        </div>

        <div className="total-amount">
          <strong>Total Amount: ${totalAmount}</strong>
        </div>

        <button type="button" onClick={handleSubmitOrder}>
          Create Order
        </button>
      </form>
    </div>
  
  );
};

export default AddOrder;
