import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // ✅ Ensure JSON parsing middleware is before routes
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', methods: 'GET,POST,PUT,DELETE', credentials: true }));

// API Routes
app.use('/api/auth', userRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/expenses', expenseRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running...' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
