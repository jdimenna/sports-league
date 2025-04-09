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

// mongoose.connect(process.env.MONGO_URI);
const options = {
    tls: { secureProtocol: 'TLSv1_2_method' }, // Force TLS 1.2
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  
  mongoose.connect(process.env.MONGO_URI, options)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api', generalRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));