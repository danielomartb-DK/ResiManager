import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import financeRoutes from './routes/financeRoutes.js';
import pqrsRoutes from './routes/pqrsRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/finance', financeRoutes);
app.use('/api/pqrs', pqrsRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'LPH Cloud Management Suite API is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
