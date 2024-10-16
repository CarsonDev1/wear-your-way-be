import Category from '../models/category.model.js';

export const createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;

		if (!name) {
			return res.status(400).json({ error: 'Name is required' });
		}

		const newCategory = new Category({ name, description });
		await newCategory.save();
		res.status(201).json(newCategory);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getCategories = async (req, res) => {
	try {
		const categories = await Category.find();
		res.status(200).json(categories);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getCategoryById = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);
		if (!category) return res.status(404).json({ error: 'Category not found' });
		res.status(200).json(category);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const updateCategory = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, description } = req.body;
		const updatedCategory = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
		if (!updatedCategory) return res.status(404).json({ error: 'Category not found' });
		res.status(200).json(updatedCategory);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const deleteCategory = async (req, res) => {
	try {
		const { id } = req.params;
		const category = await Category.findByIdAndDelete(id);
		if (!category) return res.status(404).json({ error: 'Category not found' });
		res.status(200).json({ message: 'Category deleted successfully' });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
