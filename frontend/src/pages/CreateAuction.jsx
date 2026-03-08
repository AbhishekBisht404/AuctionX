import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './CreateAuctions.css';
import isTokenValid from '../services/tokenvalidity';


export default function CreateAuction() {
  const navigate = useNavigate();
  useState(() => {
    if (!isTokenValid()) {
      navigate('/');
      return;
    }
    if(localStorage.getItem('role') !== 'seller') {
      navigate('/dashboard');
      return;
    }
  }, []);
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

              <form onSubmit={handleSubmit} className="create-auction-form">
                {error && <p className="create-auction-error">{error}</p>}

                <div className="create-auction-fields">
                  <div className="create-auction-field">
                    <label className="font-medium" htmlFor="title">
                      Item Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      name="title"
                      className="create-auction-input"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="create-auction-field">
                    <label className="font-medium" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="create-auction-textarea"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="create-auction-row">
                    <div className="create-auction-field">
                      <label className="font-medium" htmlFor="startingPrice">
                        Starting Price ($)
                      </label>
                      <input
                        id="startingPrice"
                        type="number"
                        name="startingPrice"
                        className="create-auction-input"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="create-auction-field">
                      <label className="font-medium" htmlFor="minIncrement">
                        Min Increment ($)
                      </label>
                      <input
                        id="minIncrement"
                        type="number"
                        name="minIncrement"
                        className="create-auction-input"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="create-auction-row">
                    <div className="create-auction-field">
                      <label className="font-medium" htmlFor="startTime">
                        Start Date &amp; Time
                      </label>
                      <input
                        id="startTime"
                        type="datetime-local"
                        name="startTime"
                        className="create-auction-input"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="create-auction-field">
                      <label className="font-medium" htmlFor="endTime">
                        End Date &amp; Time
                      </label>
                      <input
                        id="endTime"
                        type="datetime-local"
                        name="endTime"
                        className="create-auction-input"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="create-auction-field">
                    <label className="font-medium" htmlFor="itemImage">
                      Item Image
                    </label>
                    <input
                      id="itemImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="create-auction-file-input"
                    />
                  </div>

                  <div className="create-auction-actions">
                    <button type="submit" className="primary-btn" disabled={isSubmitting}>
                      {isSubmitting ? 'Publishing...' : 'Confirm & List Item'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="create-auction-cancel-btn"
                    >
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