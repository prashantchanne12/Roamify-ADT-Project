import express from 'express';
import Property from '../models/Property.js';
import { authMiddleware, hostMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all properties (public)
router.get('/', async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, guests, q, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    
    // Apply filters if provided
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (type) filter.type = type;
    if (minPrice) filter['price.regular'] = { $gte: Number(minPrice) };
    if (maxPrice) {
      if (filter['price.regular']) {
        filter['price.regular'].$lte = Number(maxPrice);
      } else {
        filter['price.regular'] = { $lte: Number(maxPrice) };
      }
    }
    if (guests) filter['rules.maxGuests'] = { $gte: Number(guests) };
    if (q) {
      // regex search on title, description, or city
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { 'location.city': new RegExp(q, 'i') }
      ];
    }
    
    // Only show active properties to the public
    filter.status = 'active';
    
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
      populate: { path: 'host', select: 'name profileImage' }
    };
    
    const properties = await Property.find(filter)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit)
      .sort(options.sort)
      .populate(options.populate);
    
    const totalProperties = await Property.countDocuments(filter);
    
    res.status(200).json({
      properties,
      currentPage: options.page,
      totalPages: Math.ceil(totalProperties / options.limit),
      totalProperties
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Server error while fetching properties' });
  }
});

// Get host's own listings (hosts only)
router.get('/host', authMiddleware, hostMiddleware, async (req, res) => {
  try {
    const hostProperties = await Property.find({ host: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(hostProperties);
  } catch (error) {
    console.error('Error fetching host properties:', error);
    res.status(500).json({ message: 'Server error while fetching your properties' });
  }
});

// Get property by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('host', 'name profileImage email');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.status(200).json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Server error while fetching property' });
  }
});

// Create new property (hosts only)
router.post('/', authMiddleware, hostMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      location,
      price,
      amenities,
      rules,
      rooms,
      images,
      availability
    } = req.body;
    
    const newProperty = new Property({
      host: req.user.id,
      title,
      description,
      type,
      location,
      price,
      amenities,
      rules,
      rooms,
      images,
      availability
    });
    
    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Server error while creating property' });
  }
});

// Update property (host only)
router.put('/:id', authMiddleware, hostMiddleware, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Ensure the host is the owner
    if (property.host.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }
    
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Server error while updating property' });
  }
});

// Delete property (host only)
router.delete('/:id', authMiddleware, hostMiddleware, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Ensure the host is the owner
    if (property.host.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }
    
    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Server error while deleting property' });
  }
});

export default router;