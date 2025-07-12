import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
app.use('/api/users', require('./routes/user.route'));
app.use('/api/items', require('./routes/item.route'));
app.use('/api/swaps', require('./routes/swap.route'));
app.use('/api/points', require('./routes/point.route'));

// Health check
app.get('/', (req, res) => res.send('ReWear backend running!'));

// Error handler (add this file if missing)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));