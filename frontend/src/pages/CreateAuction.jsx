import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css'; 

export default function CreateAuction() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    minIncrement: '',
    startTime: '',
    endTime: ''
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('startingPrice', formData.startingPrice);
    data.append('minIncrement', formData.minIncrement);
    data.append('startTime', formData.startTime);
    data.append('endTime', formData.endTime);
    if (image) data.append('itemImage', image);

    try {
      await api.post('/auctions', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create auction.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <h1 className="topbar-title">Create New Listing</h1>
        </header>

        <div className="dashboard-canvas">
          <div className="dashboard-stack">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Item Details</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="data-table-wrapper" style={{ padding: '2rem' }}>
                {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
                
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="font-medium">Item Title</label>
                    <input type="text" name="title" className="logout-btn" style={{ textAlign: 'left', color: 'black', marginTop: '0.5rem' }} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label className="font-medium">Description</label>
                    <textarea name="description" className="logout-btn" style={{ textAlign: 'left', color: 'black', marginTop: '0.5rem', minHeight: '100px' }} onChange={handleChange} required />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="font-medium">Starting Price ($)</label>
                      <input type="number" name="startingPrice" className="logout-btn" style={{ textAlign: 'left', color: 'black' }} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="font-medium">Min Increment ($)</label>
                      <input type="number" name="minIncrement" className="logout-btn" style={{ textAlign: 'left', color: 'black' }} onChange={handleChange} required />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="font-medium">Start Date & Time</label>
                      <input type="datetime-local" name="startTime" className="logout-btn" onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="font-medium">End Date & Time</label>
                      <input type="datetime-local" name="endTime" className="logout-btn" onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="font-medium">Item Image</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="logout-btn" style={{ border: 'none' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" className="primary-btn" disabled={isSubmitting}>
                      {isSubmitting ? 'Publishing...' : 'Confirm & List Item'}
                    </button>
                    <button type="button" onClick={() => navigate('/dashboard')} className="logout-btn" style={{ width: 'auto' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}