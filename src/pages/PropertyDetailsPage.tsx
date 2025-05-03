import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { Map, Star, Calendar, Users, Heart, Share, ChevronLeft, ChevronRight, MapPin, Wifi, Tv, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface PropertyType {
  _id: string;
  title: string;
  description: string;
  type: string;
  host: {
    _id: string;
    name: string;
    profileImage: string;
    email: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  price: {
    regular: number;
    discounted?: number;
  };
  amenities: string[];
  rules: {
    petsAllowed: boolean;
    smokingAllowed: boolean;
    eventsAllowed: boolean;
    maxGuests: number;
    checkInTime: string;
    checkOutTime: string;
  };
  rooms: {
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  images: Array<{
    url: string;
    caption?: string;
    isMain: boolean;
  }>;
  ratings: {
    average: number;
    count: number;
  };
  availability: Array<{
    startDate: string;
    endDate: string;
  }>;
}

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [saved, setSaved] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // In real app, you'd fetch the actual property
        const response = await axios.get(`/api/properties/${id}`);
        setProperty(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property:', error);
        setLoading(false);
        
        // Fallback data for development
        setProperty({
          _id: '1',
          title: 'Luxury Beach Villa with Ocean View',
          description: 'Escape to this stunning beachfront villa with panoramic views of the Pacific Ocean. Perfect for a relaxing getaway, this property features modern amenities, a private pool, spacious living areas, and direct beach access.',
          type: 'Villa',
          host: {
            _id: 'host1',
            name: 'Sarah Johnson',
            profileImage: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=150',
            email: 'sarah@example.com'
          },
          location: {
            address: '123 Coastal Highway',
            city: 'Malibu',
            state: 'California',
            country: 'USA',
            zipCode: '90265',
            coordinates: {
              latitude: 34.0259,
              longitude: -118.7798
            }
          },
          price: {
            regular: 350,
            discounted: 320
          },
          amenities: ['WiFi', 'Kitchen', 'Free parking', 'Air conditioning', 'Heating', 'Pool', 'Hot tub', 'TV'],
          rules: {
            petsAllowed: true,
            smokingAllowed: false,
            eventsAllowed: true,
            maxGuests: 8,
            checkInTime: '15:00',
            checkOutTime: '11:00'
          },
          rooms: {
            bedrooms: 4,
            beds: 5,
            bathrooms: 3
          },
          images: [
            {
              url: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
              caption: 'Exterior view',
              isMain: true
            },
            {
              url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
              caption: 'Living room',
              isMain: false
            },
            {
              url: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
              caption: 'Master bedroom',
              isMain: false
            },
            {
              url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
              caption: 'Kitchen',
              isMain: false
            },
            {
              url: 'https://images.pexels.com/photos/261327/pexels-photo-261327.jpeg',
              caption: 'Pool area',
              isMain: false
            }
          ],
          ratings: {
            average: 4.8,
            count: 124
          },
          availability: [
            {
              startDate: '2025-01-01',
              endDate: '2025-12-31'
            }
          ]
        });
      }
    };
    
    fetchProperty();
  }, [id]);
  
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await axios.get('/api/users/saved-properties');
        const savedProperties = response.data;
        
        if (savedProperties.some((p: any) => p._id === id)) {
          setSaved(true);
        }
      } catch (error) {
        console.error('Error checking saved properties:', error);
      }
    };
    
    checkIfSaved();
  }, [id, isAuthenticated]);
  
  const nextImage = () => {
    if (!property) return;
    setActiveImageIndex((prev) => (prev + 1) % property.images.length);
  };
  
  const prevImage = () => {
    if (!property) return;
    setActiveImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };
  
  const handleSaveProperty = async () => {
    if (!isAuthenticated) {
      toast('Please login to save properties', {
        icon: '🔒',
      });
      return;
    }
    
    try {
      const action = saved ? 'unsave' : 'save';
      await axios.patch(`/api/users/saved-properties/${id}`, { action });
      
      setSaved(!saved);
      toast(saved ? 'Property removed from saved list' : 'Property saved to your list', {
        icon: saved ? '🗑️' : '❤️',
      });
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to update saved properties');
    }
  };
  
  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast('Please login to book', {
        icon: '🔒',
      });
      navigate(`/login?redirect=/property/${id}`);
      return;
    }
    
    if (!checkInDate || !checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    
    if (checkInDate >= checkOutDate) {
      toast.error('Check-out date must be after check-in date');
      return;
    }
    
    // Calculate number of nights
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate total price
    const pricePerNight = property?.price.discounted || property?.price.regular || 0;
    const totalPrice = pricePerNight * nights;
    
    try {
      const bookingData = {
        propertyId: id,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        totalGuests: guests,
        totalPrice,
        specialRequests: ''
      };
      await axios.post('/api/bookings', bookingData);
      toast.success('Booking created!');
      navigate('/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-500"></div>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-neutral-800">Property not found</h2>
          <p className="mt-2 text-neutral-600">The property you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/search')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Browse properties
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Property Title and Actions */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-3xl font-bold text-neutral-800 mb-2 sm:mb-0">{property.title}</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleSaveProperty}
              className="flex items-center text-neutral-700 hover:text-primary-500 transition-colors"
            >
              <Heart className={`h-5 w-5 mr-1 ${saved ? 'fill-secondary-500 text-secondary-500' : ''}`} />
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>
            <button className="flex items-center text-neutral-700 hover:text-primary-500 transition-colors">
              <Share className="h-5 w-5 mr-1" />
              <span>Share</span>
            </button>
          </div>
        </div>
        <div className="flex items-center mt-2">
          <div className="flex items-center text-accent-500">
            <Star className="h-4 w-4 fill-accent-500" />
            <span className="ml-1 font-medium">{property.ratings.average}</span>
          </div>
          <span className="mx-2 text-neutral-400">•</span>
          <span className="text-neutral-700">{property.ratings.count} reviews</span>
          <span className="mx-2 text-neutral-400">•</span>
          <span className="text-neutral-700 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {property.location.city}, {property.location.country}
          </span>
        </div>
      </div>
      
      {/* Property Images */}
      <div className="relative mb-8">
        {!showAllImages ? (
          <div className="relative h-96 rounded-lg overflow-hidden">
            <img
              src={property.images[activeImageIndex].url}
              alt={property.images[activeImageIndex].caption || property.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-neutral-100 focus:outline-none"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-neutral-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-neutral-100 focus:outline-none"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-neutral-700" />
            </button>
            <button
              onClick={() => setShowAllImages(true)}
              className="absolute right-4 bottom-4 bg-white rounded-md px-3 py-1 shadow-md hover:bg-neutral-100 focus:outline-none text-sm font-medium"
            >
              Show all photos
            </button>
          </div>
        ) : (
          <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
            <div className="flex justify-between items-center p-4 bg-black bg-opacity-90">
              <h3 className="text-white text-xl font-semibold">{property.title}</h3>
              <button
                onClick={() => setShowAllImages(false)}
                className="text-white hover:text-neutral-300 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.images.map((image, index) => (
                <div key={index} className="relative h-96 rounded-lg overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.caption || `Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-sm">
                      {image.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Property Details */}
          <div className="mb-8 pb-8 border-b border-neutral-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold text-neutral-800 mb-2">
                  {property.type} hosted by {property.host.name}
                </h2>
                <p className="text-neutral-600">
                  {property.rooms.bedrooms} bedroom{property.rooms.bedrooms !== 1 ? 's' : ''} • 
                  {property.rooms.beds} bed{property.rooms.beds !== 1 ? 's' : ''} • 
                  {property.rooms.bathrooms} bathroom{property.rooms.bathrooms !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary-500">
                  <img
                    src={property.host.profileImage}
                    alt={property.host.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-8 pb-8 border-b border-neutral-200">
            <h3 className="text-xl font-semibold text-neutral-800 mb-4">About this place</h3>
            <p className="text-neutral-600 whitespace-pre-line">{property.description}</p>
          </div>
          
          {/* Amenities */}
          <div className="mb-8 pb-8 border-b border-neutral-200">
            <h3 className="text-xl font-semibold text-neutral-800 mb-4">What this place offers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  {amenity === 'WiFi' && <Wifi className="h-5 w-5 text-neutral-700 mr-3" />}
                  {amenity === 'TV' && <Tv className="h-5 w-5 text-neutral-700 mr-3" />}
                  {!['WiFi', 'TV'].includes(amenity) && (
                    <Check className="h-5 w-5 text-neutral-700 mr-3" />
                  )}
                  <span className="text-neutral-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* House Rules */}
          <div className="mb-8 pb-8 border-b border-neutral-200">
            <h3 className="text-xl font-semibold text-neutral-800 mb-4">House rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <span className="text-neutral-700 mr-2">Check-in:</span>
                <span className="font-medium">After {property.rules.checkInTime}</span>
              </div>
              <div className="flex items-center">
                <span className="text-neutral-700 mr-2">Check-out:</span>
                <span className="font-medium">Before {property.rules.checkOutTime}</span>
              </div>
              <div className="flex items-center">
                <span className="text-neutral-700 mr-2">Max guests:</span>
                <span className="font-medium">{property.rules.maxGuests} guests</span>
              </div>
              <div className="flex items-center">
                <span className="text-neutral-700 mr-2">Pets:</span>
                <span className="font-medium">
                  {property.rules.petsAllowed ? 'Allowed' : 'Not allowed'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-neutral-700 mr-2">Smoking:</span>
                <span className="font-medium">
                  {property.rules.smokingAllowed ? 'Allowed' : 'Not allowed'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-neutral-700 mr-2">Events:</span>
                <span className="font-medium">
                  {property.rules.eventsAllowed ? 'Allowed' : 'Not allowed'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Location */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-neutral-800 mb-4">Location</h3>
            <p className="text-neutral-600 mb-4">
              {property.location.address}, {property.location.city}, {property.location.state}, {property.location.country}
            </p>
            <div className="h-64 rounded-lg overflow-hidden border border-neutral-200">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.location.coordinates.longitude - 0.005}%2C${property.location.coordinates.latitude - 0.005}%2C${property.location.coordinates.longitude + 0.005}%2C${property.location.coordinates.latitude + 0.005}&layer=mapnik&marker=${property.location.coordinates.latitude}%2C${property.location.coordinates.longitude}`}
                className="w-full h-full"
              />
              <a
                href={`https://www.openstreetmap.org/?mlat=${property.location.coordinates.latitude}&mlon=${property.location.coordinates.longitude}#map=15/${property.location.coordinates.latitude}/${property.location.coordinates.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm text-blue-500 mt-2"
              >
                View Larger Map
              </a>
            </div>
          </div>
        </div>
        
        {/* Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-lg shadow-md border border-neutral-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xl font-bold text-neutral-800">
                  ${property.price.discounted || property.price.regular}
                </span>
                <span className="text-neutral-600"> / night</span>
                
                {property.price.discounted && (
                  <div className="mt-1">
                    <span className="text-sm text-neutral-500 line-through">
                      ${property.price.regular}
                    </span>
                    <span className="ml-2 text-sm bg-accent-500 text-white px-2 py-0.5 rounded-full">
                      Special offer
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-accent-500 fill-accent-500" />
                <span className="ml-1 text-neutral-700">
                  {property.ratings.average} · {property.ratings.count} reviews
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="border border-neutral-300 rounded-t-lg">
                <div className="grid grid-cols-2">
                  <div className="p-3 border-r border-b border-neutral-300">
                    <label htmlFor="checkin" className="block text-xs text-neutral-500 font-medium">CHECK-IN</label>
                    <input
                      type="date"
                      id="checkin"
                      className="w-full border-none p-0 pt-1 focus:ring-0 text-neutral-800"
                      onChange={(e) => setCheckInDate(e.target.value ? new Date(e.target.value) : null)}
                    />
                  </div>
                  <div className="p-3 border-b border-neutral-300">
                    <label htmlFor="checkout" className="block text-xs text-neutral-500 font-medium">CHECKOUT</label>
                    <input
                      type="date"
                      id="checkout"
                      className="w-full border-none p-0 pt-1 focus:ring-0 text-neutral-800"
                      onChange={(e) => setCheckOutDate(e.target.value ? new Date(e.target.value) : null)}
                    />
                  </div>
                </div>
                <div className="p-3">
                  <label htmlFor="guests" className="block text-xs text-neutral-500 font-medium">GUESTS</label>
                  <select
                    id="guests"
                    className="w-full border-none p-0 pt-1 focus:ring-0 text-neutral-800"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  >
                    {Array.from({ length: property.rules.maxGuests }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'guest' : 'guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleBooking}
              className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Reserve
            </button>
            
            <p className="text-center mt-3 text-sm text-neutral-500">You won't be charged yet</p>
            
            {checkInDate && checkOutDate && checkInDate < checkOutDate && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">
                      ${property.price.discounted || property.price.regular} x {Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))} nights
                    </span>
                    <span className="text-neutral-600">
                      ${(property.price.discounted || property.price.regular) * Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Cleaning fee</span>
                    <span className="text-neutral-600">$50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Service fee</span>
                    <span className="text-neutral-600">$30</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-neutral-200 flex justify-between font-semibold">
                    <span>Total before taxes</span>
                    <span>
                      ${(property.price.discounted || property.price.regular) * Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) + 50 + 30}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;