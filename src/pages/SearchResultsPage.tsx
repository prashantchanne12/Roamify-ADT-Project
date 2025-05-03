import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import { useLocation } from 'react-router-dom';

const SearchResultsPage: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { search } = useLocation();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(search);
        // map search input to full-text 'q' filter
        // support both navbar (q) and home page (location) search params
        const searchText = params.get('q') || params.get('location') || '';
        const guests = params.get('guests') || '';
        const typeParam = params.get('type') || '';
        const query = new URLSearchParams();
        if (searchText) query.append('q', searchText);
        if (guests) query.append('guests', guests);
        if (typeParam) {
          // convert plural to singular (e.g., 'Houses' -> 'House')
          const typeValue = typeParam.endsWith('s') ? typeParam.slice(0, -1) : typeParam;
          query.append('type', typeValue);
        }
        const response = await axios.get(`/api/properties?${query.toString()}`);
        setProperties(response.data.properties);
      } catch (err) {
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [search]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>
      {loading ? (
        <p>Loading properties...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <PropertyCard key={prop._id} property={prop} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No properties found matching your search criteria.</p>
      )}
    </div>
  );
};

export default SearchResultsPage;