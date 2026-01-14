import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Upload, Image } from 'lucide-react';
import './seller.css';
import Navbar from '../../Components/Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';

export default function Seller() {
  const { user } = useAuth();
  const sellerId = user?.id; // logged-in seller's id

  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    address: '',
    condition: '',
    image: null, // store File object for Multer
    imagePreview: ''
  });

  // Fetch this seller's items
  useEffect(() => {
    if (!sellerId) return;

    const fetchItems = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/seller/${sellerId}`);
        const data = await res.json();

        const mappedData = data.map(d => ({
          ...d,
          _id: d._id || d.id
        }));

        setItems(mappedData);
      } catch (err) {
        console.error(err);
        setItems([]);
      }
    };

    fetchItems();
  }, [sellerId]);

  // Form handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData(prev => ({
      ...prev,
      image: file, // File object for Multer
      imagePreview: URL.createObjectURL(file) // preview in UI
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      stock: '',
      address: '',
      condition: '',
      image: null,
      imagePreview: ''
    });
    setShowModal(false);
  };

  // Add new item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sellerId) return;

    const formPayload = new FormData();
    formPayload.append('title', formData.name);
    formPayload.append('price', formData.price);
    formPayload.append('description', formData.description);
    formPayload.append('category', formData.category);
    formPayload.append('stock', formData.stock);
    formPayload.append('address', formData.address);
    formPayload.append('condition', formData.condition);
    formPayload.append('sellerId', sellerId);

    if (formData.image) {
      formPayload.append('image', formData.image); // Multer handles this
    }

    try {
      const res = await fetch('http://localhost:5000/api/products/add', {
        method: 'POST',
        body: formPayload
      });

      const data = await res.json();
      const newItem = { ...data, _id: data._id || data.id };

      setItems(prev => [...prev, newItem]);
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Error adding item');
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      if (!id) return alert('Invalid item ID');

      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (data.success) {
        setItems(prev => prev.filter(item => item._id !== id));
      } else {
        alert(data.message || 'Failed to delete item');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting item');
    }
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
                  {item.image ? (
                    <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.title} />
                  ) : (
                    <div className="no-image"><Image size={48} /></div>
                  )}
                </div>
                <div className="item-content">
                  <h3>{item.title}</h3>
                  <p className="item-price">Rs{item.price}</p>
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

              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Item Name" />
              <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" />
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select category</option>
                <option value="Stationery">Stationery</option>
                <option value="Furniture">Furniture</option>
              </select>
              <input type="text" name="condition" value={formData.condition} onChange={handleChange} placeholder="Condition" />
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" />

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={resetForm}>Cancel</button>
                <button type="button" className="btn-submit" onClick={handleSubmit}>Add Item</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
