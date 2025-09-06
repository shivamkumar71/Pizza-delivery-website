import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken, sanitizeInput } from '../middleware/auth.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// Register
router.post('/register', async (req, res) => {
	try {
		const { name, email, password, phone, address } = req.body;
		if (!name || !email || !password) {
			return res.status(400).json({ error: 'name, email, password are required' });
		}
		const existing = await User.findOne({ email });
		if (existing) {
			return res.status(409).json({ error: 'Email already registered' });
		}
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, passwordHash, phone, address });
		const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
		res.status(201).json({
			user: { id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address },
			token
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Login
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ error: 'email and password are required' });
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}
		const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
		res.json({
			user: { id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address },
			token
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Get user profile (protected route)
router.get('/profile', authenticateToken, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-passwordHash');
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}
		res.json({ user });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Update user profile (protected route)
router.put('/profile', authenticateToken, async (req, res) => {
	try {
		const { name, phone, address } = req.body;
		const sanitizedName = sanitizeInput(name);
		const sanitizedPhone = sanitizeInput(phone);
		const sanitizedAddress = sanitizeInput(address);
		
		const user = await User.findByIdAndUpdate(
			req.user.id,
			{ name: sanitizedName, phone: sanitizedPhone, address: sanitizedAddress },
			{ new: true }
		).select('-passwordHash');
		
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}
		res.json({ user });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;


