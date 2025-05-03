import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Calendar, MapPin, Clock, Users, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Booking {
  _id: string;
  property: {
    _id: string;
    title: string;
    images: Array<{
      url: string;
      isMain: boolean;
    }>;
    location: {
      city: string;
      country: string;
    };
    price: {
      regular: number;
      discounted?: number;
    };
  };
  checkInDate: string;
  checkOutDate: string;
  totalGuests: number;
  totalPrice: number;
  bookingStatus: 'confirmed' | 'pending' | 'canceled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  specialRequests?: string;
}

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/bookings/my-bookings');
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const now = new Date();
  const upcomingBookings = bookings.filter(
    booking => new Date(booking.checkInDate) >= now
  );
  const pastBookings = bookings.filter(
    booking => new Date(booking.checkInDate) < now
  );

  const activeBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-2 text-gray-600">Manage and view your booking history</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`${
              activeTab === 'upcoming'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`${
              activeTab === 'past'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Past ({pastBookings.length})
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : activeBookings.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === 'upcoming'
              ? "You don't have any upcoming bookings."
              : "You don't have any past bookings."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Property Image */}
                <div className="md:w-72 h-48 md:h-auto relative">
                  <img
                    src={booking.property.images.find(img => img.isMain)?.url || booking.property.images[0].url}
                    alt={booking.property.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Booking Details */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col h-full">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {booking.property.title}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span>
                          {booking.property.location.city}, {booking.property.location.country}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Users className="h-5 w-5 mr-2" />
                        <span>{booking.totalGuests} guests</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>
                          {format(new Date(booking.checkInDate), 'MMM d, yyyy')} -{' '}
                          {format(new Date(booking.checkOutDate), 'MMM d, yyyy')}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-2" />
                        <span>
                          {Math.ceil(
                            (new Date(booking.checkOutDate).getTime() -
                              new Date(booking.checkInDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{' '}
                          nights
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div className="mb-4 sm:mb-0">
                        <span className="text-gray-600">Total paid</span>
                        <p className="text-2xl font-bold text-gray-900">
                          ${booking.totalPrice.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex space-x-3">
                        {booking.bookingStatus === 'confirmed' && activeTab === 'upcoming' && (
                          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/bookings/${booking._id}`)}
                          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;