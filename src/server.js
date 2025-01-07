// server.js
// TODO: make 'owner' field in reactions model to avoid populate, unify comment syntax !!
import express from 'express'; // Import Express framework
import mongoose from 'mongoose'; // Import Mongoose for MongoDB
import { swaggerSetup } from './swagger.js'; // Import Swagger setup
import publicationRouter from './routes/publicationRoute.js';
import commentRouter from './routes/commentRoute.js';
import reactionRouter from './routes/reactionRoute.js';
import dotenv from 'dotenv'; // Import dotenv for environment variables
import standardizedResponse from './middlewares/standardResponse.js'; // Import custom response middleware
// import { MongoMemoryServer } from 'mongodb-memory-server';
import './utils/logger.js';
import cors from 'cors';

dotenv.config(); // Load environment variables

const app = express(); // Create an Express application
const port = process.env.BACKEND_PORT || 6501; // Define port

// CORS - https://www.npmjs.com/package/cors
const corsOptionsDev = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};


// Middlewares
if (process.env.NODE_ENV === 'development') app.use(cors(corsOptionsDev));
//app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(standardizedResponse); // Use custom response middleware

// Routes
app.use('/api', publicationRouter);
app.use('/api', commentRouter);
app.use('/api', reactionRouter);


// Swagger configuration
swaggerSetup(app);

// Connect to MongoDB
let mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/microservice';
if (process.env.NODE_ENV === 'test') {
  /* const mongod = new MongoMemoryServer(); // Fake MongoDB for testing
  await mongod.start();
  mongoURI = mongod.getUri();
  console.log("MongoMemoryServer", mongoURI); */

  mongoURI = process.env.TEST_MONGODB_URI;
}

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB\n');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Start server
if (process.env.NODE_ENV !== 'test') { // needed to pass tests
  app.listen(port, () => {
    //console.log(`Server is running on http://localhost:${port}`);
    logger.info(`Server (Publications) is running on http://localhost:${port}`);
  });
};

export default app; // Export the Express application
