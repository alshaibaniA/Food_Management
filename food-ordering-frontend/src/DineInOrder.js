import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';  // Import useLocation

import './OrderPage.css';

const DineInOrder = () => {
  const location = useLocation(); // Get the current location/path
  const [items, setItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [orderId, setOrderId] = useState(null);  // New state for order ID
  const [orderPlaced, setOrderPlaced] = useState(false);  // New state to track if the order is placed

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8080/items')
      .then(response => {
        const filteredItems = response.data.filter(item => !item.isDelete);
        setItems(filteredItems);
        // Initialize orderItems with quantity 0 for each item
      const initializedOrderItems = filteredItems.map(item => ({ itemId: item.itemId, quantity: 0 }));
      setOrderItems(initializedOrderItems);
        setLoading(false);
      })
      .catch(error => {
        setMessage('Error fetching items');
        setLoading(false);
      });
  }, [location]);

  const handleCommentChange = (e) => {
    const newComment = e.target.value;
    if (newComment.length <= 100) {
      setComment(newComment);
      setCommentError('');
    } else {
      setCommentError('Please shorten the comment to 100 characters or less.');
    }
  };

  const handleQuantityChange = (itemId, action) => {
    setOrderItems(prevState => {
      const existingItemIndex = prevState.findIndex(item => item.itemId === itemId);
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevState];
        const currentQuantity = updatedItems[existingItemIndex].quantity;
        let newQuantity = currentQuantity;

        if (action === 'increment') {
          newQuantity = currentQuantity + 1;
        } else if (action === 'decrement' && currentQuantity > 0) {
          newQuantity = currentQuantity - 1;
        }

        if (newQuantity === 0) {
          updatedItems.splice(existingItemIndex, 1);
        } else {
          updatedItems[existingItemIndex] = { ...updatedItems[existingItemIndex], quantity: newQuantity };
        }

        return updatedItems;
      } else if (action === 'increment') {
        return [...prevState, { itemId, quantity: 1 }];
      }
      return prevState;
    });
  };

  const calculateTotalPrice = () => {
    let total = 0;
    orderItems.forEach(item => {
      const itemData = items.find(i => i.itemId === item.itemId);
      if (itemData) {
        total += itemData.price * item.quantity;
      }
    });
    setTotalPrice(total);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [orderItems]);

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

const handleCategoryClick = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const handlePlaceOrder = () => {
    // Validate phone number before proceeding with the order
    if (!/^05\d{8}$/.test(phoneNumber)) {
      setMessage('Please enter a valid phone number starting with "05" and consisting of 10 digits.');
      return;
    }

    if (orderItems.length === 0) {
      setMessage('Please add at least one item to the order.');
      return;
    }

    const orderData = {
      phone: phoneNumber,
      items: orderItems.filter(item => item.quantity > 0).map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
      })),
      comment: comment,  // Add the comment here
      order_type: 'dineIn',  // Added order type as "takeaway"
    };

    setLoading(true);
    axios.post('http://localhost:8080/orders/place', orderData)
      .then(response => {
        // Ensure that the backend is sending the necessary details, not just the orderId
        console.log('Order response:', response.data);  // Log the full response for debugging

        // Set state with the necessary details
        setOrderId(response.data.orderId);  // Set the order ID
        //setOrderItems(response.data.items || []);  // Set the order items if available
        //setTotalPrice(response.data.totalPrice || 0);  // Set total price if available
        setPhoneNumber(response.data.phone || '');  // Set the phone number if available
        setComment(response.data.comment || '');  // Set the comment if available

        setOrderPlaced(true);  // Mark that the order was placed
        setMessage('Order placed successfully!');
        setLoading(false);
      })
      .catch(error => {
        setMessage('There was an error placing your order!');
        setLoading(false);
      });
  };


  const handlePhoneChange = (e) => {
    const phoneValue = e.target.value;

    // Allow phone number starting with "05" and up to 10 digits total
    if (/^0?\d{0,9}$/.test(phoneValue)) {
      setPhoneNumber(phoneValue);
      setMessage(''); // Clear any previous messages
    } else if (phoneValue === '') {
      setPhoneNumber(''); // Allow empty phone number input
      setMessage('');
    }
  };

if (orderPlaced) {
  return (
    <div className="order-confirmation">
      <div className="confirmation-header">
        <h1>Order Confirmation</h1>
        <p className="thank-you-message">Thank you for your order! We're currently processing it.</p>
        <p className="order-id">Order ID: 1002<span>{orderId}</span></p>
      </div>

      <h3>Your Order:</h3>
      <div className="order-items-container">
        {orderItems.filter(item => item.quantity > 0).map(item => {
          const itemData = items.find(i => i.itemId === item.itemId);

          if (!itemData) {
            return (
              <div className="order-item" key={item.itemId}>
                <div className="item-details">
                  <span className="item-name">Item not found</span>
                  <span className="item-quantity">Quantity: {item.quantity}</span>
                  <span className="item-price">Price unavailable</span>
                </div>
              </div>
            );
          }

          const itemTotalPrice = itemData.price * item.quantity;

          return (
            <div className="order-item" key={item.itemId}>
              <div className="item-details">
                <span className="item-name">{itemData.itemName}</span>
                <span className="item-quantity">Quantity: {item.quantity}</span>
                <span className="item-price">{itemTotalPrice.toLocaleString()} ريال</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="total-container">
        <h4>Total: <span>{totalPrice.toLocaleString()} ريال</span></h4>
      </div>

      <div className="contact-info">
        <p>Your order will be ready soon. We will contact you at <strong>{phoneNumber}</strong> if needed.</p>
      </div>
    </div>
  );
}



  return (
    <div className="order-page-container">
      <h1 className="page-title" lang="ar">مرحباً بك في صفحة طلبات المحلي</h1>

      {loading ? (
        <p>Loading items...</p>
      ) : (
        <div>
          {Object.keys(groupedItems).map(category => (
            <div key={category} className="category-section">
              <h3
                className="category-title"
                onClick={() => setActiveCategory(activeCategory === category ? null : category)}
              >
                {category}
              </h3>
              {activeCategory === category && (
                <ul className="item-list">
                  {groupedItems[category].map(item => (
                    <li key={item.itemId} className="item-card">
                      <div className="item-image">
                        <img
                          src={`http://localhost:8080/uploads/${item.image}`}
                          alt={item.itemName}
                        />
                      </div>
                      <div className="item-details">
                        <strong>{item.itemName}</strong>
                        <span className="item-price"> ريال {item.price}</span>
                      </div>
                      <div className="quantity-controls">
                        <button onClick={() => handleQuantityChange(item.itemId, 'decrement')}>-</button>
                        <span className="quantity-display">
                          {orderItems.find(orderItem => orderItem.itemId === item.itemId)?.quantity || 0}
                        </span>
                        <button onClick={() => handleQuantityChange(item.itemId, 'increment')}>+</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="phone-input">
        <label lang="ar">رقم الجوال</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="Enter your phone number"
          maxLength="10"
        />
      </div>

      <h3>:الطلبات</h3>
      {orderItems.length > 0 ? (
        <div className="order-summary-box">
          <ul>
            {orderItems.filter(item => item.quantity > 0).map(item => {
              const itemData = items.find(i => i.itemId === item.itemId);
                  if (!itemData) return null;  // In case item data isn't found
              const itemTotalPrice = itemData?.price * item.quantity;  // Calculate total price for this item

              return (
                <li key={item.itemId}>
                  <div className="order-item">
                    <span className="item-name">{itemData?.itemName}</span>
                    <span className="item-quantity"> {item.quantity}</span>
                    <span className="item-price">{itemTotalPrice.toLocaleString()} ريال</span> {/* Formatting total price */}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="separator-line"></div> {/* Add separator here */}
          <div className="total-price">المجموع الكلي: {totalPrice.toLocaleString()} ريال</div> {/* Formatted total price */}
        </div>

      ) : (
        <p lang="ar">لم يتم اختيار طلبات</p>
      )}

      <div className="comment-input">
        <label lang="ar">أدخل رقم الطاولة</label>
        <textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Enter the table number"
          maxLength="100"
          rows="4"
        />
        {commentError && <p style={{ color: 'red' }}>{commentError}</p>}
      </div>

      <div className="place-order">
        <button
          onClick={handlePlaceOrder}
          disabled={loading || orderItems.filter(item => item.quantity > 0).length === 0 || !/^05\d{8}$/.test(phoneNumber) || comment.trim() === ''}
        >
          {loading ? 'Placing Order...' : 'أرسال الطلب'}
        </button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default DineInOrder;
