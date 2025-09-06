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
		const contact = await Contact.create({
			name: sanitizeInput(name),
			email: sanitizeInput(email),
			phone: sanitizeInput(phone),
			message: sanitizeInput(message),
			userId: req.user.id
		});
		res.status(201).json(contact);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;


