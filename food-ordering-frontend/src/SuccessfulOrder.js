import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SuccessfulOrder = () => {
    const [successfulOrders, setSuccessfulOrders] = useState([]);

    // Fetch under_process orders from the backend
    useEffect(() => {
        axios.get('http://localhost:8080/orders/successful')
            .then(response => {
                setSuccessfulOrders(response.data);
            })
            .catch(error => {
                console.error('Error fetching under process orders:', error);
            });
    }, []);

    const handleChangeStatus = (orderId) => {
        console.log("Updating order with ID:", orderId);  // Log orderId to check if it's correct
        if (orderId) {
            axios.put(`http://localhost:8080/orders/update/${orderId}`, { status: 'done' })
                .then(response => {
                    // Remove the order from the state list after it's updated
                    setSuccessfulOrders(prevState => prevState.filter(order => order.orderId !== orderId));
                })
                .catch(error => {
                    console.error('Error updating order status:', error);
                });
        } else {
            console.error('Order ID is undefined or invalid');
        }
    };

    return (
        <div className="style-order-container">
            <h1>Successful Orders</h1>
            {successfulOrders && successfulOrders.length > 0 ? (
             <div className="order-list">
                 {successfulOrders.map(order => (
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
                <p>No Successful orders available.</p>
            )}
        </div>
    );
};

export default SuccessfulOrder;
