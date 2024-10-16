import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Function to create JWT token
const createToken = (user) => {
	return jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

// Register function
export const register = async (req, res) => {
	try {
		const { username, email, phone, password } = req.body;

		// Check required fields
		if (!username || !email || !phone || !password) {
			return res.status(400).json({ error: 'All required fields must be filled' });
		}

		// Check if email already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ error: 'Email already exists' });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 12);

		// Create new user
		const newUser = new User({
			username,
			email,
			phone,
			password: hashedPassword,
		});

		await newUser.save();

		// Create JWT token
		const token = createToken(newUser);

		res.status(201).json({
			access_token: token,
			token_type: 'Bearer',
			client_id: newUser._id.toString(),
			user: {
				_id: newUser._id,
				username: newUser.username,
				email: newUser.email,
				phone: newUser.phone,
			},
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Login function
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: 'All required fields must be filled' });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ error: 'Invalid email or password' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ error: 'Invalid email or password' });
		}

		const token = createToken(user);

		res.status(200).json({
			access_token: token,
			user: {
				_id: user._id,
				username: user.username,
				email: user.email,
				phone: user.phone,
			},
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Middleware to refresh token if expired
export const refreshToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(' ')[1];
		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				const newToken = createToken(user);
				res.setHeader('Authorization', `Bearer ${newToken}`);
			}
			req.user = user;
			next();
		});
	} else {
		res.status(401).json({ error: 'Authorization header missing' });
	}
};

// api get me when login successful check authentication
export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user.userId);
		if (!user) return res.status(404).json({ error: 'User not found' });
		res.status(200).json(user);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Get all users
export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Get user by ID
export const getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ error: 'User not found' });
		res.status(200).json(user);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Update user
export const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedData = req.body;

		// Nếu mật khẩu được cập nhật, mã hóa nó
		if (updatedData.password) {
			updatedData.password = await bcrypt.hash(updatedData.password, 12);
		}

		const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });

		if (!updatedUser) return res.status(404).json({ error: 'User not found' });

		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Delete user
export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findByIdAndDelete(id);

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
