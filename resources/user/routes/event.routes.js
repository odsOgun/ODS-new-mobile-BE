import express from 'express';
import upload  from '../../../utils/image/multer.js';
import { createEvent, deleteEvent, getAllEvents, getEventById, getEventsByDate, updateEvent }  from '../../user/controllers/eventsController.js';


const router = express.Router();

// Upload middleware: Upload both event gallery and videos
const multiUpload = upload.fields([
  { name: 'eventGallery', maxCount: 10 },  // Max 10 images
  { name: 'videos', maxCount: 5 }          // Max 5 videos
]);

// Event routes
router.post('/events', multiUpload, createEvent);
router.get('/events', getAllEvents);
router.get('/events/:date', getEventsByDate);
router.get('/events/:id', getEventById);
router.put('/events/:id', multiUpload, updateEvent);
router.delete('/events/:id', deleteEvent);

export default router;
