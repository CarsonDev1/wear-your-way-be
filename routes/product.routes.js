import express from 'express';
import multer from 'multer';
import * as productController from '../controllers/product.controller.js';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/search', productController.searchProducts);
router.post('/create', upload.fields([{ name: 'image' }, { name: 'video' }]), productController.createProduct);
router.put('/:id', upload.fields([{ name: 'image' }, { name: 'video' }]), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
