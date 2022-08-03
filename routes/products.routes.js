const express = require('express');

const { categoryExists } = require('../middlewares/category.middleware');

const {
  protectSession,
} = require('../middlewares/auth.middleware');
const {
  getAllProducts,
  getProducById,
  getAllCategories,
  createProduct,
  updateProduct,
  disableProduct,
  createCategory,
  updateCategory,
  getCategoryById,
  filterSearchProducts,
} = require('../controllers/products.controller');
const {
  productExists,
  protectProductAuthor,
} = require('../middlewares/product.middleware');

const { upload } = require('../utils/upload.util');
const {
  createProductValidators,
} = require('../middlewares/validators.middlewares');

const productsRouter = express.Router();

productsRouter.get('/categories', getAllCategories);
productsRouter.get('/category/:id',categoryExists, getCategoryById);
productsRouter.get('/', getAllProducts);
productsRouter.get('/filter/:search', filterSearchProducts);
productsRouter.get('/:id', productExists, getProducById);

productsRouter.use(protectSession);

productsRouter.post(
  '/',
  upload.array('productsImg', 5),
  createProductValidators,
  categoryExists,

  createProduct
);

productsRouter
  .route('/:id')
  .patch(productExists, protectProductAuthor, updateProduct)
  .delete(productExists, protectProductAuthor, disableProduct);

productsRouter.post('/categories', createCategory);

productsRouter.patch('/category/:id', categoryExists, updateCategory);

module.exports = { productsRouter };
