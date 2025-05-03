import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ManageListingsPage: React.FC = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get('/api/properties/host');
        setListings(res.data);
      } catch (error) {
        console.error('Failed to load host listings:', error);
        toast.error('Failed to load your listings');
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Your Listings</h1>
      <div className="flex justify-end mb-6">
        <Link
          to="/host/create-listing"
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Add New Listing
        </Link>
      </div>
      {listings.length === 0 ? (
        <p className="text-gray-600">You have no listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing._id} className="bg-white rounded-lg shadow overflow-hidden">
              <Link to={`/property/${listing._id}`}>
                <img
                  src={
                    listing.images.find((img: any) => img.isMain)?.url ||
                    listing.images[0]?.url
                  }
                  alt={listing.title}
                  className="h-48 w-full object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to={`/property/${listing._id}`} className="block text-lg font-semibold hover:underline">
                  {listing.title}
                </Link>
                <p className="text-gray-600">
                  {listing.location.city}, {listing.location.country}
                </p>
                <p className="text-primary-600 font-semibold mt-2">
                  ${listing.price.regular.toFixed(2)} / night
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageListingsPage;