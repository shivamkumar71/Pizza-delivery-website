import express from 'express';
import Contact from '../models/Contact.js';
import { authenticateToken, sanitizeInput } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
	try {
		const { name, email, phone, message } = req.body;
		if (!name || !email || !message) {
			return res.status(400).json({ error: 'name, email and message are required' });
		}
		const indiaTime = new Date().toLocaleString('en-IN', {
			timeZone: 'Asia/Kolkata',
			year: 'numeric',
			month: 'short',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		});
		const contact = await Contact.create({
			name: sanitizeInput(name),
			email: sanitizeInput(email),
			phone: sanitizeInput(phone),
			message: sanitizeInput(message),
			userId: req.user.id,
			createdAtIST: indiaTime
		});
		res.status(201).json(contact);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;


