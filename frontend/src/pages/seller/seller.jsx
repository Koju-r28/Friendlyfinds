import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Upload, Image } from 'lucide-react';
import './seller.css';
import Navbar from '../../Components/Navbar/Navbar';

export default function Seller() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    address: '',
    condition: '',
    image: '',
    imagePreview: ''
  });

  // Get logged-in seller (simulate)
  const sellerId = localStorage.getItem('sellerId') || 'userA';

  // Fetch items for this seller from backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products?sellerId=${sellerId}`);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItems();
  }, [sellerId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result, imagePreview: reader.result }));
    reader.readAsDataURL(file);
  };

  // Add or update item
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, description, category, stock, address, condition, image } = formData;

    if (!name || !price || !description || !category || !stock || !address || !condition) {
      alert('All fields are required');
      return;
    }

    const payload = {
      title: name,
      price: Number(price),
      description,
      category,
      stock: Number(stock),
      address,
      sellerId,
      condition,
      image: image || ''
    };

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save item');
      const savedItem = await res.json();

      setItems(prev => [...prev, savedItem.product]);
      resetForm();
      alert('Item saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving item');
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item');
      setItems(prev => prev.filter(item => item._id !== id));
      alert('Item deleted successfully!');
    } catch (err) {
      console.error(err);
      alert('Error deleting item');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      stock: '',
      address: '',
      condition: '',
      image: '',
      imagePreview: ''
    });
    setEditingItem(null);
    setShowModal(false);
  };

  return (
    <>
      <Navbar />
      <div className="seller-container">
        <div className="seller-header">
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Add New Item
          </button>
          <h1>Seller Page</h1>
          <p>Add your items to be sold</p>
        </div>

        <div className="items-grid">
          {items.length === 0 ? (
            <div className="empty-state">
              <Image size={64} />
              <h3>No items yet</h3>
              <p>Start by adding your first item</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item._id} className="item-card">
                <div className="item-image">
                  {item.image ? <img src={item.image} alt={item.title} /> : <div className="no-image"><Image size={48} /></div>}
                </div>
                <div className="item-content">
                  <h3>{item.title}</h3>
                  <p className="item-price">${item.price}</p>
                  <p className="item-description">{item.description}</p>
                  <div className="item-meta">
                    <span className="item-category">{item.category}</span>
                    <span className="item-stock">Stock: {item.stock}</span>
                  </div>
                </div>
                <div className="item-actions">
                  <button className="btn-delete" onClick={() => handleDelete(item._id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={resetForm}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add New Item</h2>
                <button className="btn-close" onClick={resetForm}><X size={24} /></button>
              </div>

              <div className="item-form">
                <label className="image-upload-label">
                  {formData.imagePreview ? (
                    <img src={formData.imagePreview} alt="Preview" className="image-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <Upload size={48} />
                      <p>Click to upload image</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>

                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Item Name" />
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Price" />
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" />
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option value="">Select category</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Furniture">Furniture</option>
                </select>
                <input type="text" name="condition" value={formData.condition} onChange={handleInputChange} placeholder="Condition" />
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" />
                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Stock" />

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={resetForm}>Cancel</button>
                  <button type="button" className="btn-submit" onClick={handleSubmit}>Add Item</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
