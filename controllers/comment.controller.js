import Comment from '../models/comment.model.js';

export const createComment = async (req, res) => {
	try {
		const { content, productId, author } = req.body;

		const comment = new Comment({
			productId,
			content,
			author,
		});

		await comment.save();
		res.status(201).json(comment);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
