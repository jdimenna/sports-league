import express from 'express';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard-data', (req, res) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];

  let userName = 'Guest';
  let userId = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userName = decoded.name || decoded.email || 'User';
      userId = decoded.id || null;
    } catch (err) {
      // Token is invalid, but we still respond as Guest
      console.log('Invalid token:', err.message);
    }
  }

  res.json({
    message: `Hello, ${userName}`,
    userId: userId
  });
});

router.get('/admin', authMiddleware, (req, res) => {
  res.json({ message: 'Secure dashboard content', userId: req.user.id });
});

export default router;