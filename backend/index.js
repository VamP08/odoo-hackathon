// app.js (or index.js)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler.js';

// Import routes (ESM style)
import userRoutes from './routes/user.route.js';
import itemRoutes from './routes/item.route.js';
import swapRoutes from './routes/swap.route.js';
import pointRoutes from './routes/point.route.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/points', pointRoutes);

// Health check
app.get('/', (req, res) => res.send('ReWear backend running!'));

// Fallback for unhandled routes
app.use((req, res, next) => {
  const err = new Error('Route Not Found');
  err.status = 404;
  next(err);
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
