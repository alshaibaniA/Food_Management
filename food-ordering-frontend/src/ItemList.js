import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ItemList.css'; // Your CSS file

const ItemList = () => {
    const [items, setItems] = useState([]);

    // Fetch items when the component mounts
    const fetchItems = () => {
        axios.get('http://localhost:8080/items')
            .then(response => {
                if (Array.isArray(response.data)) {
                const filteredItems = response.data.filter(item => !item.isRemoved);
                setItems(filteredItems);
           } else {
                    console.error('Expected an array but got:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching items:', error);
            });
    };

    // Fetch items on component mount
    useEffect(() => {
        fetchItems();
    }, []);

    // Handle the button click for toggling isDelete
    const handleToggleDelete = (itemId, currentStatus) => {
        const newDeleteStatus = !currentStatus;  // Toggle the current status

        // Send the updated status to the backend
        axios.put(`http://localhost:8080/items/update/${itemId}`, { isDelete: newDeleteStatus })
            .then(() => {
                // Update the item state with the new isDelete value
                setItems(prevItems =>
                    prevItems.map(item =>
                        item.itemId === itemId ? { ...item, isDelete: newDeleteStatus } : item
                    )
                );
            })
            .catch(error => {
                console.error('Error updating item:', error);
            });
    };

    // Handle permanent deletion (new isRemoved flag)
        const handlePermanentDelete = (itemId) => {
            const confirmation = window.confirm("هل أنت متأكد من أنك تريد حذف هذا العنصر بشكل دائم؟");
            if(confirmation){
            // Send a request to the backend to permanently remove the item
            axios.put(`http://localhost:8080/items/remove/${itemId}`, { isRemoved: true })
                .then(() => {
                    // Remove the item from the state as it's permanently deleted
                    setItems(prevItems => prevItems.filter(item => item.itemId !== itemId));
                })
                .catch(error => {
                    console.error('Error permanently deleting item:', error);
                });
       } };

    return (
        <div className="item-list-container">
            <h1>Food Items</h1>

            {items.length > 0 ? (
                <div className="item-grid">
                    {items.map(item => (
                        <div key={item.itemId} className="item-card">
                            <div className="item-image">
                                {item.image && (
                                    <img
                                        src={`http://localhost:8080/uploads/${item.image}?t=${new Date().getTime()}`}
                                        alt={item.itemName}
                                    />
                                )}
                            </div>
                            <div className="item-details">
                                <strong>{item.itemName}</strong>
                                <p>{item.category}</p>
                                <p className="item-price">${item.price}</p>
                            </div>
                            <div className="item-swap-button">
                                <button
                                    onClick={() => handleToggleDelete(item.itemId, item.isDelete)}
                                    style={{ backgroundColor: item.isDelete ? 'red' : 'green', marginRight:'10px' }}
                                >
                                    {item.isDelete ? 'عرض' : 'اخفاء'}
                                </button>

                                {/* Add Permanent Delete Button */}
                                <button
                                    onClick={() => handlePermanentDelete(item.itemId)}
                                    style={{ backgroundColor: 'darkred', color: 'white' }}
                                >
                                    حذف نهائي
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No items available</p>
            )}
        </div>
    );
};

export default ItemList;
