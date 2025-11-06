import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './mongodbConfig.js';
import userRoutes from './users/users.route.js';
import notesRoutes from './notes/notes.route.js';
import nodesRoutes from './nodes/nodes.route.js';
import aiRoutes from './ai/ai.route.js';
import userProfileRoutes from './userProfiles/userProfile.route.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Middleware
// CORS configuration - Allow all origins and methods
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'X-Access-Token'],
  exposedHeaders: ['Content-Length', 'X-JSON'],
  credentials: false,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/nodes', nodesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/userProfiles', userProfileRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// Default route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'BetterNote Backend API', version: '1.0.0' });
});

// 404 handler (must be before error handler)
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware (must be LAST)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      error: 'Invalid JSON',
      message: err.message,
      details: 'Please check your JSON format'
    });
    return;
  }
  
  // Handle other errors
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!',
    message: err.message || 'Internal server error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Listening on: 0.0.0.0:${PORT} (accessible from all network interfaces)`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS: Enabled for ALL origins (no CORS errors)`);
});

export default app;