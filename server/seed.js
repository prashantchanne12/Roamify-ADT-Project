import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Property from './models/Property.js';
import Booking from './models/Booking.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');

    // Clear existing collections
    await Booking.deleteMany();
    await Property.deleteMany();
    await User.deleteMany();

    // Create users
    const hostUser = await User.create({
      name: 'John Host',
      email: 'host@example.com',
      password: 'password123',
      role: 'host'
    });
    const guestUser = await User.create({
      name: 'Jane Guest',
      email: 'guest@example.com',
      password: 'password123',
      role: 'user'
    });

    // Seed properties
    const propertiesData = [
      {
        host: hostUser._id,
        title: 'Luxury Beach Villa',
        description: 'Oceanfront villa with private pool and stunning views.',
        type: 'Villa',
        location: {
          address: '101 Ocean Drive', city: 'Malibu', state: 'CA', country: 'USA', zipCode: '90265', coordinates: { latitude: 34.0259, longitude: -118.7798 }
        },
        price: { regular: 350, discounted: 320 },
        amenities: ['WiFi', 'Kitchen', 'Free parking', 'Pool'],
        rules: { petsAllowed: false, smokingAllowed: false, eventsAllowed: false, maxGuests: 8 },
        rooms: { bedrooms: 4, beds: 4, bathrooms: 3 },
        images: [{ url: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg', caption: 'Luxury Beach Villa', isMain: true }],
        availability: [{ startDate: new Date(), endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60) }],
        status: 'active'
      },
      {
        host: hostUser._id,
        title: 'Modern Downtown Apartment',
        description: 'Sleek apartment in the heart of the city.',
        type: 'Apartment',
        location: {
          address: '200 City Center', city: 'New York', state: 'NY', country: 'USA', zipCode: '10001', coordinates: { latitude: 40.7128, longitude: -74.0060 }
        },
        price: { regular: 180 },
        amenities: ['WiFi', 'Air conditioning', 'Washer'],
        rules: { petsAllowed: false, smokingAllowed: false, eventsAllowed: false, maxGuests: 2 },
        rooms: { bedrooms: 1, beds: 1, bathrooms: 1 },
        images: [{ url: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg', caption: 'Modern Downtown Apartment', isMain: true }],
        availability: [{ startDate: new Date(), endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60) }],
        status: 'active'
      },
      {
        host: hostUser._id,
        title: 'Cozy Mountain Cabin',
        description: 'Rustic cabin with mountain views and fireplace.',
        type: 'Cabin',
        location: {
          address: '300 Mountain Rd', city: 'Aspen', state: 'CO', country: 'USA', zipCode: '81611', coordinates: { latitude: 39.1911, longitude: -106.8175 }
        },
        price: { regular: 220, discounted: 195 },
        amenities: ['WiFi', 'Heating', 'Kitchen'],
        rules: { petsAllowed: true, smokingAllowed: false, eventsAllowed: false, maxGuests: 4 },
        rooms: { bedrooms: 2, beds: 2, bathrooms: 1 },
        images: [{ url: 'https://images.pexels.com/photos/803975/pexels-photo-803975.jpeg', caption: 'Cozy Mountain Cabin', isMain: true }],
        availability: [{ startDate: new Date(), endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60) }],
        status: 'active'
      },
      {
        host: hostUser._id,
        title: 'Historic City Center Loft',
        description: 'Loft in the historic district with modern amenities.',
        type: 'Apartment',
        location: {
          address: '400 Rue de la Histoy', city: 'Paris', state: 'Ile-de-France', country: 'France', zipCode: '75001', coordinates: { latitude: 48.8566, longitude: 2.3522 }
        },
        price: { regular: 210 },
        amenities: ['WiFi', 'Washer', 'Dryer'],
        rules: { petsAllowed: false, smokingAllowed: false, eventsAllowed: false, maxGuests: 3 },
        rooms: { bedrooms: 1, beds: 1, bathrooms: 1 },
        images: [{ url: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg', caption: 'Historic City Center Loft', isMain: true }],
        availability: [{ startDate: new Date(), endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60) }],
        status: 'active'
      },
      {
        host: hostUser._id,
        title: 'Seaside Family Home',
        description: 'Spacious family home by the sea.',
        type: 'House',
        location: {
          address: '500 Ocean Ave', city: 'Sydney', state: 'NSW', country: 'Australia', zipCode: '2000', coordinates: { latitude: -33.8688, longitude: 151.2093 }
        },
        price: { regular: 275, discounted: 245 },
        amenities: ['WiFi', 'Kitchen', 'Free parking'],
        rules: { petsAllowed: true, smokingAllowed: false, eventsAllowed: false, maxGuests: 6 },
        rooms: { bedrooms: 3, beds: 4, bathrooms: 2 },
        images: [{ url: 'https://images.pexels.com/photos/2582818/pexels-photo-2582818.jpeg', caption: 'Seaside Family Home', isMain: true }],
        availability: [{ startDate: new Date(), endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60) }],
        status: 'active'
      },
      {
        host: hostUser._id,
        title: 'Tropical Island Bungalow',
        description: 'Bungalow surrounded by nature on a tropical island.',
        type: 'Cottage',
        location: {
          address: '600 Island Rd', city: 'Bali', state: 'Bali', country: 'Indonesia', zipCode: '80361', coordinates: { latitude: -8.4095, longitude: 115.1889 }
        },
        price: { regular: 190 },
        amenities: ['WiFi', 'Kitchen', 'Free parking'],
        rules: { petsAllowed: false, smokingAllowed: false, eventsAllowed: false, maxGuests: 2 },
        rooms: { bedrooms: 1, beds: 1, bathrooms: 1 },
        images: [{ url: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg', caption: 'Tropical Island Bungalow', isMain: true }],
        availability: [{ startDate: new Date(), endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60) }],
        status: 'active'
      }
    ];
    const properties = await Property.insertMany(propertiesData);

    // Create a booking for the first property
    await Booking.create({
      property: properties[0]._id,
      guest: guestUser._id,
      checkInDate: new Date(),
      checkOutDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      totalGuests: 2,
      totalPrice: properties[0].price.regular * 2,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid'
    });

    console.log('Data seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
