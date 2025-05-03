import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { MapPin, Users, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface BookingDetails {
  _id: string;
  property: {
    _id: string;
    title: string;
    images: { url: string; isMain: boolean }[];
    location: { city: string; country: string };
    price: { regular: number; discounted?: number };
  };
  checkInDate: string;
  checkOutDate: string;
  totalGuests: number;
  totalPrice: number;
  bookingStatus: string;
  paymentStatus: string;
  specialRequests?: string;
}

const BookingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/bookings/${id}`);
      return;
    }
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`/api/bookings/${id}`);
        setBooking(response.data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast.error('Failed to load booking');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id, isAuthenticated, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-500"></div></div>;
  }

  if (!booking) {
    return <div className="max-w-2xl mx-auto p-6"><p className="text-center text-gray-600">Booking not found</p></div>;
  }

  const nights = Math.ceil((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24));
  const pricePerNight = booking.property.price.discounted || booking.property.price.regular;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={() => navigate('/bookings')} className="mb-4 text-primary-500 hover:underline">&larr; Back to My Bookings</button>
      <h1 className="text-2xl font-bold mb-4">{booking.property.title}</h1>
      <div className="mb-4">
        <img
          src={booking.property.images.find(img => img.isMain)?.url || booking.property.images[0]?.url}
          alt={booking.property.title}
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Booking Details</h2>
          <p><Calendar className="inline-block mr-1"/> {format(new Date(booking.checkInDate), 'MMM d, yyyy')} - {format(new Date(booking.checkOutDate), 'MMM d, yyyy')} ({nights} nights)</p>
          <p><Users className="inline-block mr-1"/> {booking.totalGuests} guest{booking.totalGuests !== 1 ? 's' : ''}</p>
          <p className="mt-2 font-semibold">Total Price: ${booking.totalPrice.toFixed(2)}</p>
          <p>Status: <span className="capitalize">{booking.bookingStatus}</span></p>
          <p>Payment Status: <span className="capitalize">{booking.paymentStatus}</span></p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Property Location</h2>
          <p><MapPin className="inline-block mr-1"/> {booking.property.location.city}, {booking.property.location.country}</p>
        </div>
      </div>
      {booking.specialRequests && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Special Requests</h2>
          <p>{booking.specialRequests}</p>
        </div>
      )}
    </div>
  );
};

export default BookingDetailsPage;
