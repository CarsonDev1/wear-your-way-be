import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from './config.js';
import cors from 'cors';

import productRoutes from './routes/product.routes.js';
import commentRoutes from './routes/comment.routes.js';
import categoryRoutes from './routes/category.routes.js';
import authRoutes from './routes/auth.routes.js';
import multer from 'multer';
import { updateProduct } from './controllers/product.controller.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

mongoose
	.connect(config.mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.log(err));

app.use('/api/products', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } });

app.put('/api/products/:id', upload.fields([{ name: 'image' }, { name: 'video' }]), updateProduct);

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
