// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
	const token = req.headers['authorization'];

	if (!token) {
		return res.status(401).json({ error: 'No token provided' });
	}

	jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).json({ error: 'Failed to authenticate token' });
		}

		req.user = decoded;
		next();
	});
};

export const checkAdminRole = (req, res, next) => {
	if (req.user.role !== 'admin') {
		return res.status(403).json({ error: 'Access denied' });
	}
	next();
};
