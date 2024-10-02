// const Event = require("../models/pastEvents");
import Event from '../models/pastEvents.js';
import cloudinary from '../../../utils/image/cloudinary.js';
import upload from '../../../utils/image/multer.js';

// Create a new event with image/video upload
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, attendees, speakers, panelists, sponsors, guests } = req.body;

    // Upload files to Cloudinary
    const eventGallery = [];
    const videos = [];

    if (req.files['eventGallery']) {
      for (const file of req.files['eventGallery']) {
        const result = await cloudinary.uploader.upload(file.path, { folder: 'events/gallery' });
        eventGallery.push(result.secure_url);
      }
    }

    if (req.files['videos']) {
      for (const file of req.files['videos']) {
        const result = await cloudinary.uploader.upload(file.path, { folder: 'events/videos', resource_type: 'video' });
        videos.push(result.secure_url);
      }
    }

    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      attendees,
      speakers,
      panelists,
      sponsors,
      guests,
      eventGallery,
      videos
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Controller to fetch events by date
export const getEventsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const events = await Event.find({ date });

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No events found for the given date'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Controller to fetch a single event by ID
export const getEventById = async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Event retrieved successfully',
        data: event
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  };
  

// Controller to fetch all events
export const getAllEvents = async (req, res) => {
    try {
      const events = await Event.find();
      res.status(200).json({
        success: true,
        message: 'Events retrieved successfully',
        data: events
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  };

  // Controller to update an event
export const updateEvent = async (req, res) => {
    try {
      const { title, description, date, time, location, attendees, speakers, panelists, sponsors, guests } = req.body;
  
      let event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
  
      const eventGallery = req.files['eventGallery'] ? req.files['eventGallery'].map(file => file.path) : event.eventGallery;
      const videos = req.files['videos'] ? req.files['videos'].map(file => file.path) : event.videos;
  
      event.title = title || event.title;
      event.description = description || event.description;
      event.date = date || event.date;
      event.time = time || event.time;
      event.location = location || event.location;
      event.attendees = attendees || event.attendees;
      event.speakers = speakers || event.speakers;
      event.panelists = panelists || event.panelists;
      event.sponsors = sponsors || event.sponsors;
      event.guests = guests || event.guests;
      event.eventGallery = eventGallery;
      event.videos = videos;
  
      await event.save();
  
      res.status(200).json({
        success: true,
        message: 'Event updated successfully',
        data: event
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  };

  // Controller to delete an event
export const deleteEvent = async (req, res) => {
    try {
      const event = await Event.findByIdAndDelete(req.params.id);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Event deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  };
  