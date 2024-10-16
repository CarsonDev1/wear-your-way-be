import express from 'express';
import * as categoryController from '../controllers/category.controller.js';

const router = express.Router();

router.post('/create', categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;
