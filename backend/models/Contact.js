import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, lowercase: true, trim: true },
		phone: { type: String },
		message: { type: String, required: true, trim: true },
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
	},
	{ timestamps: true }
);

export default mongoose.model('Contact', contactSchema);


