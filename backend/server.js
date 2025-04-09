import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/protected.js';
import generalRoutes from './routes/general.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.use('/api', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api', generalRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));