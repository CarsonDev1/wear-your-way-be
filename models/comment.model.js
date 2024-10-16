import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
	blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
	content: { type: String, required: true },
	author: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
