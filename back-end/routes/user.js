const express = require('express');
const User = require('../models/user'); // Assuming the User model is correct
const router = express.Router();

// Update user data by ID
router.put('/update', async (req, res) => {
  const { userId, username, email, phoneNumber, profileImage } = req.body;

  // Check for required fields
  if (!userId || !username || !email || !phoneNumber || !profileImage) {
    return res.status(400).json({ message: 'All fields (userId, username, email, phoneNumber, profileImage) are required' });
  }

  try {
    console.log('Updating user with ID:', userId);

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, phoneNumber, profileImage },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
