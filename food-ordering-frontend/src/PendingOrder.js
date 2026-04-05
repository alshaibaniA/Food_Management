import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './orderStyle.css'; // Import the CSS for styling

const PendingOrder = () => {
    const [pendingOrders, setPendingOrders] = useState([]);

    // Function to fetch pending orders
    const fetchPendingOrders = () => {
        axios.get('http://localhost:8080/orders/pending')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setPendingOrders(response.data);
                } else {
                    console.error('Expected an array but got:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching pending orders:', error);
            });
    };

    // Fetch pending orders initially and set up polling
    useEffect(() => {
        // Fetch the initial set of orders
        fetchPendingOrders();

        // Set an interval to fetch new orders every 60 seconds (60000 milliseconds)
        const intervalId = setInterval(fetchPendingOrders, 60000); // 60 seconds = 60000 milliseconds

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // The empty array ensures this runs only once when the component mounts

    const handleChangeStatus = (orderId) => {
        if (orderId) {
            axios.put(`http://localhost:8080/orders/update/${orderId}`, { status: 'under_process' })
                .then(() => {
                    // After updating, remove the order from the list of pending orders
                    setPendingOrders(prevState => prevState.filter(order => order.orderId !== orderId));
                    // Optionally refetch the orders to ensure everything is up-to-date
                    fetchPendingOrders();
                })
                .catch(error => {
                    console.error('Error updating order status:', error);
                });
        }
    };

    return (
        <div className="style-order-container">
            <h1>Pending Orders</h1>
            {pendingOrders && Array.isArray(pendingOrders) && pendingOrders.length > 0 ? (
                <div className="order-list">
                    {pendingOrders.map(order => (
                        <div className="order-block" key={order.orderId}>
                            <div className="order-header">
                                <h3>Order ID: {order.orderId}</h3>
                                <p>Phone: {order.phone}</p>
                            </div>
                            <div className="order-details">
                                <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
                                <div className="order-type">
                                    <strong>Order Type: </strong>
                                    <span className={order.orderType === 'dineIn' ? 'dine-in' : 'takeaway'}>
                                        {order.orderType === 'dineIn' ? 'Dine In' : 'Takeaway'}
                                    </span>
                                </div>

                                {/* Displaying the comment */}
                                {order.comment && (
                                    <div className="order-comment">
                                        <strong>Comment: </strong>
                                        <p>{order.comment}</p>
                                    </div>
                                )}
                                <div>
                                    {order.items.map(item => (
                                        <div key={item.orderItemId} className="order-item">
                                            <span className="item-name">{item.item.itemName}</span>
                                            <span className="item-badge">{item.quantity}</span>
                                            <span className="item-price">{(item.item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="total-price">
                                    Total Price: {order.totalPrice.toFixed(2)}
                                </div>
                            </div>
                            <button className="action-btn" onClick={() => handleChangeStatus(order.orderId)}>
                                Mark as Under Process
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No pending orders available.</p>
            )}
        </div>
    );
};

export default PendingOrder;
