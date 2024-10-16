// middleware/upload.js
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/avatars');
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error('Only JPEG, JPG, and PNG files are allowed'), false);
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit
});

export default upload;
