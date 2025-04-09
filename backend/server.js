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


const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ MONGO_URI is missing. Check your environment variables.");
  process.exit(1);
}

console.log("Mongo URI:", process.env.MONGO_URI);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

app.use('/api', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api', generalRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));