import Product from '../models/product.model.js';

export const createProduct = async (req, res) => {
	try {
		const { title, description, price, discountPrice, category, size, loadCapacity, engine } = req.body;
		const images = req.body.imageUrls; // Assuming image URLs are sent in the request body
		const video = req.body.videoUrl; // Assuming video URL is sent in the request body

		const newProduct = new Product({
			title,
			description,
			price,
			discountPrice,
			imageUrls: images,
			videoUrl: video,
			category,
			size,
			loadCapacity,
			engine,
		});

		await newProduct.save();
		res.status(201).json(newProduct);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getProducts = async (req, res) => {
	try {
		const products = await Product.find().populate('comments').populate('category');
		res.status(200).json(products);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id).populate('comments').populate('category');
		if (!product) return res.status(404).json({ error: 'Product not found' });
		res.status(200).json(product);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const searchProducts = async (req, res) => {
	try {
		const { title, content, createdAt, discountPrice, size, loadCapacity, engine } = req.body;

		const searchCriteria = {};
		if (title) searchCriteria.title = { $regex: title, $options: 'i' };
		if (content) searchCriteria.content = { $regex: content, $options: 'i' };
		if (createdAt) searchCriteria.createdAt = { $gte: new Date(createdAt) };
		if (discountPrice) searchCriteria.discountPrice = discountPrice;
		if (size) searchCriteria.size = { $regex: size, $options: 'i' };
		if (loadCapacity) searchCriteria.loadCapacity = loadCapacity;
		if (engine) searchCriteria.engine = { $regex: engine, $options: 'i' };

		const products = await Product.find(searchCriteria).populate('comments');
		res.status(200).json(products);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findByIdAndDelete(id);

		if (!product) {
			return res.status(404).json({ error: 'Product not found' });
		}

		res.status(200).json({ message: 'Product deleted successfully' });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description, price, discountPrice, category, size, loadCapacity, engine } = req.body;

		const images = req.body.imageUrls; // Assuming image URLs are sent in the request body
		const video = req.body.videoUrl; // Assuming video URL is sent in the request body

		const formattedCategory = Array.isArray(category)
			? category
					.filter((id) => mongoose.Types.ObjectId.isValid(id)) // Validate ObjectId strings
					.map((id) => mongoose.Types.ObjectId(id))
			: [];

		const updatedProductData = {
			title,
			description,
			price,
			discountPrice,
			category: formattedCategory.length > 0 ? formattedCategory : undefined, // Do not include if empty
			size,
			loadCapacity,
			engine,
		};

		if (images && images.length > 0) {
			updatedProductData.imageUrls = images;
		}
		if (video) {
			updatedProductData.videoUrl = video;
		}

		const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductData, { new: true });

		if (!updatedProduct) {
			return res.status(404).json({ error: 'Product not found' });
		}

		res.status(200).json(updatedProduct);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
