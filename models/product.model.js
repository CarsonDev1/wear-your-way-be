import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true },
	discountPrice: { type: Number },
	imageUrls: { type: [String], required: true },
	videoUrl: { type: String },
	createdAt: { type: Date, default: Date.now },
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
	category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
	size: { type: String, required: true },
	loadCapacity: { type: Number, required: true },
	engine: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
