import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
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
    <div className="flex min-h-screen w-screen overflow-hidden">
      <main className="flex flex-1 flex-col bg-[#2C3D73] text-[#FFD372]">
        <header className="px-10 pt-6 max-md:px-5">
          <h1 className="m-0 text-[1.4rem] font-semibold">Create New Listing</h1>
        </header>

        <div className="w-full p-10 max-md:p-5">
          <div className="flex w-full flex-col">
            <div className="w-full rounded border border-[#7CA8DC] bg-[#3d4d80]">
              <div className="border-b border-[#7CA8DC] px-7 py-5">
                <h3 className="m-0 text-[1.1rem] font-semibold text-[#FFD372]">Item Details</h3>
              </div>

              <form onSubmit={handleSubmit} className="box-border p-7 max-md:px-4 max-md:pb-6 max-md:pt-5">
                {error && <p className="mb-4 mt-0 text-sm text-[#ff6b6b]">{error}</p>}

                <div className="grid gap-5">
                  <div className="flex flex-col">
                    <label className="mb-1.5 text-sm font-medium" htmlFor="title">
                      Item Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      name="title"
                      className="w-full box-border rounded border border-[#7CA8DC] bg-white px-3 py-2.5 text-[0.95rem] text-[#2C3D73] outline-[#7CA8DC]"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1.5 text-sm font-medium" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="min-h-[120px] w-full resize-y box-border rounded border border-[#7CA8DC] bg-white px-3 py-2.5 text-[0.95rem] text-[#2C3D73] outline-[#7CA8DC]"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                    <div className="flex flex-col">
                      <label className="mb-1.5 text-sm font-medium" htmlFor="startingPrice">
                        Starting Price ($)
                      </label>
                      <input
                        id="startingPrice"
                        type="number"
                        name="startingPrice"
                        className="w-full box-border rounded border border-[#7CA8DC] bg-white px-3 py-2.5 text-[0.95rem] text-[#2C3D73] outline-[#7CA8DC]"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-1.5 text-sm font-medium" htmlFor="minIncrement">
                        Min Increment ($)
                      </label>
                      <input
                        id="minIncrement"
                        type="number"
                        name="minIncrement"
                        className="w-full box-border rounded border border-[#7CA8DC] bg-white px-3 py-2.5 text-[0.95rem] text-[#2C3D73] outline-[#7CA8DC]"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                    <div className="flex flex-col">
                      <label className="mb-1.5 text-sm font-medium" htmlFor="startTime">
                        Start Date &amp; Time
                      </label>
                      <input
                        id="startTime"
                        type="datetime-local"
                        name="startTime"
                        className="w-full box-border cursor-pointer rounded border border-[#7CA8DC] bg-white px-4 py-2.5 text-base text-[#2C3D73] outline-[#7CA8DC]"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-1.5 text-sm font-medium" htmlFor="endTime">
                        End Date &amp; Time
                      </label>
                      <input
                        id="endTime"
                        type="datetime-local"
                        name="endTime"
                        className="w-full box-border cursor-pointer rounded border border-[#7CA8DC] bg-white px-4 py-2.5 text-base text-[#2C3D73] outline-[#7CA8DC]"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1.5 text-sm font-medium" htmlFor="itemImage">
                      Item Image
                    </label>
                    <input
                      id="itemImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full box-border rounded border border-[#7CA8DC] bg-white px-3 py-2.5 text-[0.95rem] text-[#2C3D73] outline-[#7CA8DC]"
                    />
                  </div>

                  <div className="mt-2 flex flex-wrap gap-3">
                    <button type="submit" className="inline-block rounded border-none bg-[#F15B42] px-6 py-2.5 text-[0.95rem] font-medium text-white transition hover:bg-[#F49CC4] disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting}>
                      {isSubmitting ? 'Publishing...' : 'Confirm & List Item'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="cursor-pointer rounded border border-[#7CA8DC] bg-transparent px-6 py-2.5 text-[0.95rem] text-[#FFD372] transition hover:bg-[rgba(124,170,220,0.12)]"
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