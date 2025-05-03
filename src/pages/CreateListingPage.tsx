import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const types = ['Hotel','Apartment','House','Villa','Cabin','Cottage','Other'];
  const amenitiesList = ['WiFi','Kitchen','Free parking','Air conditioning','Heating','Washer','Dryer','TV','Pool','Hot tub','Gym','Breakfast'];
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState(types[0]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [beds, setBeds] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');

  const handleAmenityChange = (amen: string) => {
    setAmenities(prev => prev.includes(amen) ? prev.filter(a => a !== amen) : [...prev, amen]);
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setImageUrls(prev => {
      const arr = [...prev];
      arr[index] = value;
      return arr;
    });
  };

  const addImageField = () => setImageUrls(prev => [...prev, '']);
  const removeImageField = (index: number) => setImageUrls(prev => prev.filter((_, i) => i !== index));

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        toast.success('Location fetched');
      },
      (error) => {
        toast.error('Unable to fetch location');
        console.error(error);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const locationData: any = { address, city, state: stateVal, country, zipCode };
      if (latitude && longitude) {
        locationData.coordinates = {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        };
      }
      const payload = {
        title,
        description,
        type,
        location: locationData,
        price: { regular: Number(price), discounted: discountedPrice ? Number(discountedPrice) : undefined },
        amenities,
        rules: { maxGuests: Number(maxGuests) },
        rooms: { bedrooms: Number(bedrooms), beds: Number(beds), bathrooms: Number(bathrooms) },
        images: imageUrls.filter(u => u).map((url, idx) => ({ url, isMain: idx === 0 }))
      };
      await axios.post('/api/properties', payload);
      toast.success('Listing created!');
      navigate('/host/listings');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create listing');
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Property Info</h2>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium">Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-6">Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium">City</label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium">State</label>
            <input type="text" value={stateVal} onChange={e => setStateVal(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium">Country</label>
            <input type="text" value={country} onChange={e => setCountry(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium">Zip Code</label>
            <input type="text" value={zipCode} onChange={e => setZipCode(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium">Latitude</label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={e => setLatitude(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g. 34.0522"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Longitude</label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={e => setLongitude(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g. -118.2437"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={handleGetLocation}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            >
              Use Current Location
            </button>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-6">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Price per Night ($)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium">Discounted Price ($)</label>
            <input type="number" value={discountedPrice} onChange={e => setDiscountedPrice(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-6">Rooms & Guests</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium">Max Guests</label>
            <input type="number" value={maxGuests} onChange={e => setMaxGuests(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium">Bedrooms</label>
            <input type="number" value={bedrooms} onChange={e => setBedrooms(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium">Beds</label>
            <input type="number" value={beds} onChange={e => setBeds(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium">Bathrooms</label>
            <input type="number" value={bathrooms} onChange={e => setBathrooms(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-6">Amenities</h2>
        <div>
          <label className="block text-sm font-medium">Amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
            {amenitiesList.map(amen => (
              <label key={amen} className="inline-flex items-center">
                <input type="checkbox" checked={amenities.includes(amen)} onChange={() => handleAmenityChange(amen)} className="form-checkbox" />
                <span className="ml-2 text-sm">{amen}</span>
              </label>
            ))}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-6">Images</h2>
        {imageUrls.map((url, idx) => (
          <div key={idx} className="flex items-center mb-2">
            <input
              type="text"
              placeholder={`Image URL ${idx + 1}`}
              value={url}
              onChange={e => handleImageUrlChange(idx, e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {imageUrls.length > 1 && (
              <button type="button" onClick={() => removeImageField(idx)} className="ml-2 text-red-500">
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addImageField}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
        >
          Add Image
        </button>
        <button type="submit" className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold shadow-md hover:from-primary-600 hover:to-primary-700 transition">
          Create Listing
        </button>
      </form>
    </div>
  );
};

export default CreateListingPage;