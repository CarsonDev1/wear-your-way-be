// middleware/authenticate.js
import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
	const token = req.header('Authorization')?.split(' ')[1]; // Assuming Bearer token is used

	if (!token) {
		return res.status(401).json({ error: 'Access denied. No token provided.' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // Attach decoded token payload to req.user
		next();
	} catch (err) {
		res.status(400).json({ error: 'Invalid token.' });
	}
};

export default authenticate;
