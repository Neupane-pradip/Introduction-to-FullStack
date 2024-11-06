const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Event = require('../models/Event');

const apiController = {
  // Return all events as JSON
  all: async (req, res) => {
    try {
      const events = await Event.find();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error });
    }
  },

  // Return a single event as JSON
  show: async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching event', error });
    }
  },

  // Update an event or create it if it doesn't exist
  update: async (req, res) => {
    try {
      let event = await Event.findById(req.params.id);
      if (!event) {
        event = new Event(req.body);  // Create a new event if it doesn't exist
      } else {
        event.set(req.body);  // Update the event with new data
      }
      await event.save();
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: 'Error saving event', error });
    }
  },

  // Authenticate the user and send a JWT token
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error during login', error });
    }
  },
};

module.exports = apiController;