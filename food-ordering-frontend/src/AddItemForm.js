import React, { useState } from 'react';
import axios from 'axios';
import './AddItemForm.css';  // Import CSS for styling

const AddItemForm = ({ setItems }) => {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  // Handle image file selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create FormData object to send both the item details and image file
    const formData = new FormData();
    formData.append('file', image);          // Add the image file to the formData
    formData.append('itemName', itemName);   // Add itemName
    formData.append('category', category);   // Add category
    formData.append('price', price);         // Add price

    // Send POST request to Spring Boot API to add the new item
    axios.post('http://localhost:8080/items/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Make sure the request knows it's multipart/form-data
      }
    })
    .then(response => {
      alert('Item added successfully!');

      // Reset the form fields
      setItemName('');
      setCategory('');
      setPrice('');
      setImage(null);    // Reset the image state

      // Fetch the updated list of items to include the newly added item
      axios.get('http://localhost:8080/items')
        .then(response => {
          const itemsWithImageUrl = response.data.map(item => ({
            ...item,
            imageUrl: `http://localhost:8080/uploads/${item.image}`  // Add full URL to image
          }));
          setItems(itemsWithImageUrl);  // Update the items list in the parent component
        })
        .catch(error => {
          console.error('There was an error fetching the items!', error);
        });
    })
    .catch(error => {
      console.error('There was an error adding the item!', error);
    });
  };
// Categories list
  const categories = [
    "الأطباق الرئيسية",
    "المشروبات",
    "قائمة موسمية",
    "صلصات للصوص"
  ];
  return (
    <div className="add-item-container">
      <h2 className="form-title">Add New Item</h2>
      <form className="add-item-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="itemName">Item Name</label>
          <input
            id="itemName"
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="form-input"
                  >
                    <option value="">اختر فئة</option>  {/* Default option */}
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            id="image"
            type="file"
            onChange={handleImageChange}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">Add Item</button>
      </form>
    </div>
  );
};

export default AddItemForm;
