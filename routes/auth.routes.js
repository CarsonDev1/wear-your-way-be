import express from 'express';
import {
	register,
	login,
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
	getMe,
} from '../controllers/auth.controller.js';
import authorize from '../middlewares/authorize.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/register', upload.single('avatar'), register);
router.post('/login', login);

router.use(authenticate);

router.get('/users', authorize('admin'), getAllUsers);
router.get('/users/:id', authorize(['admin', 'user']), getUserById);
router.put('/users/:id', authorize(['admin', 'user']), updateUser);
router.delete('/users/:id', authorize('admin'), deleteUser);
router.get('/me', getMe);
export default router;
