import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import gameMetricRoutes from './routes/gameMetricRoutes.js'; // Ensure you have this route file

// Configure dotenv to load environment variables
dotenv.config();

// Initialize the express app
const app = express();
app.use(cors());
// Middleware to parse incoming JSON requests
app.use(express.json());

// Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

// MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB!');
});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB!');
});

// Add your routes
app.use('/api/metrics', gameMetricRoutes);

// Basic error-handling middleware
app.use((err, req, res, next) => {
  console.error('An error occurred:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start the server
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  connect(); // Call the function to connect to MongoDB
  console.log(`Server running on port ${PORT}`);
});

// Optional: Graceful shutdown handling
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed due to application termination');
    process.exit(0);
  });
});
