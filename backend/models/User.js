import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		passwordHash: { type: String, required: true },
		phone: { type: String },
		address: { type: String },
		// Password reset token and expiry for forgot-password flow
		resetToken: { type: String },
		resetTokenExpiry: { type: Date },
		// Notification preferences
		notifications: {
			email: { type: Boolean, default: true },
			sms: { type: Boolean, default: false },
			push: { type: Boolean, default: true }
		}
	},
	{ timestamps: true }
);

export default mongoose.model('User', userSchema);


