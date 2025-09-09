import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken, sanitizeInput } from '../middleware/auth.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

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
		const indiaTime = new Date().toLocaleString('en-IN', {
			timeZone: 'Asia/Kolkata',
			year: 'numeric',
			month: 'short',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		});
		const user = await User.create({ name, email, passwordHash, phone, address, createdAtIST: indiaTime });
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
		const { name, phone, address, notifications } = req.body;
		const sanitizedName = sanitizeInput(name);
		const sanitizedPhone = sanitizeInput(phone);
		const sanitizedAddress = sanitizeInput(address);
		
		const updateObj = { name: sanitizedName, phone: sanitizedPhone, address: sanitizedAddress };
		if (notifications) {
			updateObj.notifications = notifications;
		}
		const user = await User.findByIdAndUpdate(
			req.user.id,
			updateObj,
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

// Forgot password - generate token and send email
router.post('/forgot-password', async (req, res) => {
	try {
		const { email } = req.body;
		if (!email) return res.status(400).json({ error: 'email is required' });
		const user = await User.findOne({ email });
		if (!user) return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });

		const token = crypto.randomBytes(20).toString('hex');
		const expiry = Date.now() + 1000 * 60 * 60; // 1 hour

		user.resetToken = token;
		user.resetTokenExpiry = expiry;
		await user.save();

		const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;
		// send email (best-effort, don't block)
		try {
			await sendEmail(user.email, 'Password Reset', `Reset your password: ${resetUrl}`);
		} catch (e) {
			console.error('Email send failed', e.message);
		}

		res.json({ message: 'If that email exists, a reset link has been sent.' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Reset password using token
router.post('/reset-password/:token', async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;
		if (!password) return res.status(400).json({ error: 'password is required' });

		const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
		if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

		const passwordHash = await bcrypt.hash(password, 10);
		user.passwordHash = passwordHash;
		user.resetToken = undefined;
		user.resetTokenExpiry = undefined;
		await user.save();

		res.json({ message: 'Password has been reset successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Change password for authenticated user
router.post('/change-password', authenticateToken, async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;
		if (!currentPassword || !newPassword) return res.status(400).json({ error: 'current and new password are required' });

		const user = await User.findById(req.user.id);
		if (!user) return res.status(404).json({ error: 'User not found' });

		const ok = await bcrypt.compare(currentPassword, user.passwordHash);
		if (!ok) return res.status(401).json({ error: 'Current password is incorrect' });

		user.passwordHash = await bcrypt.hash(newPassword, 10);
		await user.save();

		res.json({ message: 'Password changed successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;


