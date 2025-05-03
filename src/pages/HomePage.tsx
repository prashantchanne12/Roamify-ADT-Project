import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Hotel, Home as HomeIcon, Building, Tent, Warehouse, MapPin } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { formatISO } from 'date-fns';

interface PropertyType {
  _id: string;
  title: string;
  type: string;
  location: {
    city: string;
    country: string;
  };
  price: {
    regular: number;
    discounted?: number;
  };
  images: Array<{
    url: string;
    isMain: boolean;
  }>;
  ratings: {
    average: number;
    count: number;
  };
}

const HomePage: React.FC = () => {
  // Initialize featuredProperties as an empty array instead of undefined
  const [featuredProperties, setFeaturedProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        // In a real app, you might have an endpoint for featured properties
        const response = await axios.get('/api/properties?limit=6');
        setFeaturedProperties(response.data.properties);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        setLoading(false);
        
        // Fallback data for development
        setFeaturedProperties([
          {
            _id: '1',
            title: 'Luxury Beach Villa',
            type: 'Villa',
            location: {
              city: 'Malibu',
              country: 'USA'
            },
            price: {
              regular: 350,
              discounted: 320
            },
            images: [
              {
                url: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
                isMain: true
              }
            ],
            ratings: {
              average: 4.8,
              count: 124
            }
          },
          {
            _id: '2',
            title: 'Modern Downtown Apartment',
            type: 'Apartment',
            location: {
              city: 'New York',
              country: 'USA'
            },
            price: {
              regular: 180
            },
            images: [
              {
                url: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
                isMain: true
              }
            ],
            ratings: {
              average: 4.6,
              count: 89
            }
          },
          {
            _id: '3',
            title: 'Cozy Mountain Cabin',
            type: 'Cabin',
            location: {
              city: 'Aspen',
              country: 'USA'
            },
            price: {
              regular: 220,
              discounted: 195
            },
            images: [
              {
                url: 'https://images.pexels.com/photos/803975/pexels-photo-803975.jpeg',
                isMain: true
              }
            ],
            ratings: {
              average: 4.9,
              count: 76
            }
          },
          {
            _id: '4',
            title: 'Historic City Center Loft',
            type: 'Apartment',
            location: {
              city: 'Paris',
              country: 'France'
            },
            price: {
              regular: 210
            },
            images: [
              {
                url: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg',
                isMain: true
              }
            ],
            ratings: {
              average: 4.7,
              count: 104
            }
          },
          {
            _id: '5',
            title: 'Seaside Family Home',
            type: 'House',
            location: {
              city: 'Sydney',
              country: 'Australia'
            },
            price: {
              regular: 275,
              discounted: 245
            },
            images: [
              {
                url: 'https://images.pexels.com/photos/2582818/pexels-photo-2582818.jpeg',
                isMain: true
              }
            ],
            ratings: {
              average: 4.5,
              count: 62
            }
          },
          {
            _id: '6',
            title: 'Tropical Island Bungalow',
            type: 'Cottage',
            location: {
              city: 'Bali',
              country: 'Indonesia'
            },
            price: {
              regular: 190
            },
            images: [
              {
                url: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg',
                isMain: true
              }
            ],
            ratings: {
              average: 4.8,
              count: 93
            }
          }
        ]);
      }
    };

    fetchFeaturedProperties();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const queryParams = new URLSearchParams();
    
    if (location) {
      queryParams.append('location', location);
    }
    
    if (checkIn) {
      queryParams.append('checkIn', formatISO(checkIn));
    }
    
    if (checkOut) {
      queryParams.append('checkOut', formatISO(checkOut));
    }
    
    if (guests > 1) {
      queryParams.append('guests', guests.toString());
    }
    
    navigate(`/search?${queryParams.toString()}`);
  };

  const propertyTypes = [
    { icon: <HomeIcon size={24} />, name: 'Houses' },
    { icon: <Building size={24} />, name: 'Apartments' },
    { icon: <Hotel size={24} />, name: 'Hotels' },
    { icon: <Tent size={24} />, name: 'Cabins' },
    { icon: <Warehouse size={24} />, name: 'Villas' }
  ];

  const popularDestinations = [
    { name: 'New York', country: 'USA', image: 'https://images.pexels.com/photos/2224861/pexels-photo-2224861.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Paris', country: 'France', image: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg' },
    { name: 'Tokyo', country: 'Japan', image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg' },
    { name: 'Barcelona', country: 'Spain', image: 'https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg animate-fade-in">
            Find Your Perfect Stay
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl drop-shadow-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Discover amazing places to stay around the world at unbeatable prices
          </p>

          {/* Search Form */}
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-1">Where</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                  <input
                    type="text"
                    id="location"
                    placeholder="Destination"
                    className="pl-10 w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="check-in" className="block text-sm font-medium text-neutral-700 mb-1">Check in</label>
                <input
                  type="date"
                  id="check-in"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                  onChange={(e) => setCheckIn(e.target.value ? new Date(e.target.value) : null)}
                />
              </div>
              
              <div>
                <label htmlFor="check-out" className="block text-sm font-medium text-neutral-700 mb-1">Check out</label>
                <input
                  type="date"
                  id="check-out"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                  onChange={(e) => setCheckOut(e.target.value ? new Date(e.target.value) : null)}
                />
              </div>
              
              <div className="flex flex-col md:flex-row items-end">
                <div className="flex-grow mb-2 md:mb-0 md:mr-2">
                  <label htmlFor="guests" className="block text-sm font-medium text-neutral-700 mb-1">Guests</label>
                  <select
                    id="guests"
                    className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center w-full md:w-auto"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-8 text-center">Find your perfect accommodation</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {propertyTypes && propertyTypes.map((type, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-primary-100"
                onClick={() => navigate(`/search?type=${type.name}`)}
              >
                <div className="text-primary-500 mb-3">{type.icon}</div>
                <span className="text-neutral-800 font-medium">{type.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-2">Featured properties</h2>
          <p className="text-neutral-600 mb-8">Handpicked accommodations for your comfort</p>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-neutral-200 rounded-lg h-64 mb-4"></div>
                  <div className="bg-neutral-200 h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-neutral-200 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties && featuredProperties.length > 0 ? (
                featuredProperties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))
              ) : (
                <div className="col-span-full text-center text-neutral-600">
                  No featured properties available at the moment.
                </div>
              )}
            </div>
          )}
          
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/search')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              View all properties
            </button>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-2">Popular destinations</h2>
          <p className="text-neutral-600 mb-8">Explore our most-visited locations worldwide</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations && popularDestinations.map((destination, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/search?location=${destination.name}`)}
              >
                <div className="h-64 w-full">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="text-xl font-bold">{destination.name}</h3>
                    <p>{destination.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Host CTA */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-8 md:mb-0 md:w-2/3">
              <h2 className="text-3xl font-bold mb-4">Become a host</h2>
              <p className="text-primary-100 max-w-2xl">
                Turn your extra space into extra income. Share your home, earn additional income, and connect with travelers from around the world.
              </p>
            </div>
            <div>
              <button
                onClick={() => navigate('/register?role=host')}
                className="px-6 py-3 bg-white text-primary-600 font-medium rounded-md hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 focus:ring-offset-primary-500"
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;