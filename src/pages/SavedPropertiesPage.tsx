import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import toast from 'react-hot-toast';

const SavedPropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get('/api/users/saved-properties');
        setProperties(res.data);
      } catch (error) {
        console.error('Error fetching saved properties:', error);
        toast.error('Failed to load saved properties');
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-6 h-6 text-rose-500" />
        <h1 className="text-3xl font-bold text-gray-900">Saved Properties</h1>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-500" />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg">No saved properties yet</p>
          <p className="mt-2">Properties you save will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(prop => (
            <PropertyCard key={prop._id} property={prop} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPropertiesPage;