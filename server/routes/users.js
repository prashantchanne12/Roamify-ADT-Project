import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// Update user profile
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { name, phoneNumber, profileImage } = req.body;
    
    // Find user and update
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, phoneNumber, profileImage } },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// Save/unsave property
router.patch('/saved-properties/:propertyId', authMiddleware, async (req, res) => {
  try {
    const { action } = req.body; // 'save' or 'unsave'
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (action === 'save') {
      // Add property to saved list if not already there
      if (!user.savedProperties.includes(req.params.propertyId)) {
        user.savedProperties.push(req.params.propertyId);
      }
    } else if (action === 'unsave') {
      // Remove property from saved list
      user.savedProperties = user.savedProperties.filter(
        property => property.toString() !== req.params.propertyId
      );
    }
    
    await user.save();
    res.status(200).json(user.savedProperties);
  } catch (error) {
    console.error('Error updating saved properties:', error);
    res.status(500).json({ message: 'Server error while updating saved properties' });
  }
});

// Get saved properties
router.get('/saved-properties', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('savedProperties')
      .select('savedProperties');
    
    res.status(200).json(user.savedProperties);
  } catch (error) {
    console.error('Error fetching saved properties:', error);
    res.status(500).json({ message: 'Server error while fetching saved properties' });
  }
});

export default router;