import express from 'express';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all bookings for current user
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ guest: req.user.id })
      .populate('property', 'title images location price')
      .sort({ createdAt: -1 });
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
});

// Get bookings for host's properties
router.get('/host-bookings', authMiddleware, async (req, res) => {
  try {
    // First, get all properties owned by the host
    const properties = await Property.find({ host: req.user.id }).select('_id');
    const propertyIds = properties.map(property => property._id);
    
    // Then get all bookings for these properties
    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate('property', 'title images location')
      .populate('guest', 'name email profileImage')
      .sort({ createdAt: -1 });
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching host bookings:', error);
    res.status(500).json({ message: 'Server error while fetching host bookings' });
  }
});

// Get a specific booking
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({ path: 'property', populate: { path: 'host', select: 'name profileImage email' } })
      .populate('guest', 'name profileImage email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Ensure user has permission (guest, host, or admin)
    // permission check: guest, property host, or admin
    if (
      booking.guest._id.toString() !== req.user.id &&
      booking.property.host._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error while fetching booking' });
  }
});

// Create a booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      propertyId,
      checkInDate,
      checkOutDate,
      totalGuests,
      totalPrice,
      specialRequests
    } = req.body;
    
    // Validate the property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Validate the dates don't conflict with existing bookings
    const conflictingBooking = await Booking.findOne({
      property: propertyId,
      $or: [
        { 
          checkInDate: { $lte: new Date(checkOutDate) },
          checkOutDate: { $gte: new Date(checkInDate) }
        }
      ],
      bookingStatus: { $in: ['confirmed', 'pending'] }
    });
    
    if (conflictingBooking) {
      return res.status(400).json({ message: 'Property is not available for these dates' });
    }
    
    // Create the booking
    const newBooking = new Booking({
      property: propertyId,
      guest: req.user.id,
      checkInDate,
      checkOutDate,
      totalGuests,
      totalPrice,
      specialRequests,
      bookingStatus: 'pending',
      paymentStatus: 'pending'
    });
    
    const savedBooking = await newBooking.save();
    
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error while creating booking' });
  }
});

// Update booking status (cancel, confirm, etc.)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { bookingStatus, cancellationReason } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // For cancellation, either the guest or host/admin can do it
    // For confirmation, only the host/admin can do it
    const property = await Property.findById(booking.property);
    
    if (bookingStatus === 'canceled') {
      // Guest can cancel their own booking
      if (booking.guest.toString() !== req.user.id && 
          property.host.toString() !== req.user.id && 
          req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }
      
      booking.cancellationReason = cancellationReason;
    } else {
      // Only host or admin can confirm or complete a booking
      if (property.host.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this booking status' });
      }
    }
    
    booking.bookingStatus = bookingStatus;
    await booking.save();
    
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Server error while updating booking status' });
  }
});

export default router;