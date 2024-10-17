import app from './app.js';
import dotenv from 'dotenv';
import logger from './utils/log/logger.js';
import connectDB from './database/db.js';

dotenv.config(); // Load environment variables at the top

const port = process.env.PORT || 3456;

// Start the server
const server = app.listen(port, async () => {
  try {
    await connectDB(process.env.MONGO_URI); // Connect to MongoDB
    console.log('Database connected successfully');
    logger.info(`Server is running on port ${port}`);
  } catch (error) {
    logger.error('Database connection failed:', error);
  }
});

// Gracefully handle server shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
