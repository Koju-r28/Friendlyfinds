import React, { useState } from 'react';
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
    image: null,
    imagePreview: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...formData, id: item.id, image: formData.imagePreview || item.image }
          : item
      ));
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
        image: formData.imagePreview,
        createdAt: new Date().toLocaleDateString()
      };
      setItems([...items, newItem]);
    }
    
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      stock: item.stock,
      image: null,
      imagePreview: item.image
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      stock: '',
      image: null,
      imagePreview: null
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
          <Plus size={20} />
          Add New Item
        </button>
        <h1>Seller Page</h1>
            <p>Add your items to be sold</p>


      </div>

      <div className="items-grid">
        {items.length === 0 ? (
          <div className="empty-state">
            <Image size={64} />
            <h3>No items yet</h3>
            <p>Start by adding your first item to sell</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="item-card">
              <div className="item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="no-image">
                    <Image size={48} />
                  </div>
                )}
              </div>
              <div className="item-content">
                <h3>{item.name}</h3>
                <p className="item-price">${item.price}</p>
                <p className="item-description">{item.description}</p>
                <div className="item-meta">
                  <span className="item-category">{item.category}</span>
                  <span className="item-stock">Stock: {item.stock}</span>
                </div>
              </div>
              <div className="item-actions">
                <button className="btn-edit" onClick={() => handleEdit(item)}>
                  <Edit2 size={18} />
                </button>
                <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
              <button className="btn-close" onClick={resetForm}>
                <X size={24} />
              </button>
            </div>
            
            <div className="item-form">
              <div className="image-upload-section">
                <label className="image-upload-label">
                  {formData.imagePreview ? (
                    <img src={formData.imagePreview} alt="Preview" className="image-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <Upload size={48} />
                      <p>Click to upload image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div className="form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter item name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Furniture">Furniture</option>
                
                </select>
              </div>
              <div className="form-group">
                  <label>Seller Name *</label>
                  <input
                    type="text"
                    name="seller name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter yourname"
                  />
                </div>
                 <div className="form-group">
                  <label>Condition *</label>
                  <input
                    type="text"
                    name="Condition of item"
                    value={formData.condition}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter condition of item"
                  />
                </div>

              

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Cancel
                </button>
                <button type="button" className="btn-submit" onClick={handleSubmit}>
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}