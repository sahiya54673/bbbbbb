const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

// Fallback routes for Vercel Serverless Functions where /api might be stripped
app.use('/auth', require('./routes/authRoutes'));
app.use('/posts', require('./routes/postRoutes'));
app.use('/comments', require('./routes/commentRoutes'));

// Error middleware
app.use(errorHandler);

// Only listen if not running as a serverless function (Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
