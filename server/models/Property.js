import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Property description is required']
  },
  type: {
    type: String,
    required: true,
    enum: ['Hotel', 'Apartment', 'House', 'Villa', 'Cabin', 'Cottage', 'Other']
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zipCode: {
      type: String
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  price: {
    regular: {
      type: Number,
      required: true
    },
    discounted: {
      type: Number
    }
  },
  amenities: [{
    type: String,
    enum: ['WiFi', 'Kitchen', 'Free parking', 'Air conditioning', 'Heating', 'Washer', 'Dryer', 'TV', 'Pool', 'Hot tub', 'Gym', 'Breakfast']
  }],
  rules: {
    petsAllowed: {
      type: Boolean,
      default: false
    },
    smokingAllowed: {
      type: Boolean,
      default: false
    },
    eventsAllowed: {
      type: Boolean,
      default: false
    },
    maxGuests: {
      type: Number,
      required: true,
      min: 1
    },
    checkInTime: {
      type: String,
      default: '15:00'
    },
    checkOutTime: {
      type: String,
      default: '11:00'
    }
  },
  rooms: {
    bedrooms: {
      type: Number,
      required: true,
      min: 0
    },
    beds: {
      type: Number,
      required: true,
      min: 1
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 0
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String
    },
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  ratings: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  availability: [{
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'rejected'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for search queries
propertySchema.index({ 'location.city': 'text', 'location.state': 'text', 'location.country': 'text', 'title': 'text', 'description': 'text' });

const Property = mongoose.model('Property', propertySchema);

export default Property;