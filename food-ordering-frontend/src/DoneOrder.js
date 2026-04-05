import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoneOrder = () => {
    const [doneOrders, setDoneOrders] = useState([]);

    // Fetch done orders from the backend
    useEffect(() => {
        axios.get('http://localhost:8080/orders/done-order')
            .then(response => {
                setDoneOrders(response.data);
            })
            .catch(error => {
                console.error('Error fetching done orders:', error);
            });
    }, []);

    // Calculate the total price of all orders
    const calculateTotalPrice = () => {
        return doneOrders.reduce((total, order) => total + order.totalPrice, 0).toFixed(2);
    };

// Count the number of Takeaway and DineIn orders
    const countOrderTypes = () => {
        const count = { takeaway: 0, dineIn: 0 };

        doneOrders.forEach(order => {
            if (order.orderType === 'takeaway') {
                count.takeaway++;
            } else if (order.orderType === 'dineIn') {
                count.dineIn++;
            }
        });

        return count;
    };
    const handleChangeStatus = (orderId) => {
        console.log("Updating order with ID:", orderId);  // Log orderId to check if it's correct
        if (orderId) {
            axios.put(`http://localhost:8080/orders/update/${orderId}`, { status: 'done' })
                .then(response => {
                    // Remove the order from the state list after it's updated
                    setDoneOrders(prevState => prevState.filter(order => order.orderId !== orderId));
                })
                .catch(error => {
                    console.error('Error updating order status:', error);
                });
        } else {
            console.error('Order ID is undefined or invalid');
        }
    };
    const { takeaway, dineIn } = countOrderTypes(); // Get the counts for takeaway and dineIn

    return (
        <div className="style-order-container">
            <h1>Done Orders</h1>

            {/* Total Price Section */}
            <div style={{ color: 'red', fontWeight: 'bold', fontSize: '20px', marginBottom: '20px' }}>
                Total Price of All Orders: ${calculateTotalPrice()}
            </div>
            {/* Display the number of Takeaway and DineIn orders */}
            <div style={{ color:'green',fontSize: '18px', marginBottom: '20px' }}>
                <strong>Take away Orders:</strong> {takeaway} <br /><br />
                <strong>Dine-In Orders:</strong> {dineIn}
            </div>
            {/* Orders List */}
            {doneOrders && doneOrders.length > 0 ? (
                <div className="order-list">
                    {doneOrders.map(order => (
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
                                Mark as Done
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No Done orders available.</p>
            )}
        </div>
    );
};

export default DoneOrder;
