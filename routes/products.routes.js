const express = require('express');

const { categoryExists } = require('../middlewares/category.middleware');

// Middlewares
const {
  createUserValidators,
} = require('../middlewares/validators.middleware');

const { userExists } = require('../middlewares/users.middleware');

const {
  protectSession,
  protectUserAccount,
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
} = require('../controllers/products.controller');
const {
  productExists,
  protectProductAuthor,
} = require('../middlewares/product.middleware');
const {
  createProductValidators,
} = require('../middlewares/validators.middlewares');

const productsRouter = express.Router();

productsRouter.get('/categories', getAllCategories);
productsRouter.get('/', getAllProducts);
productsRouter.get('/:id', productExists, getProducById);

productsRouter.use(protectSession);

productsRouter.post('/', createProductValidators,categoryExists, createProduct);

productsRouter
  .route('/:id')
  .patch(productExists, protectProductAuthor, updateProduct)
  .delete(productExists, protectProductAuthor, disableProduct);

productsRouter.post('/categories', createCategory);

productsRouter.patch('/categories/:id', categoryExists, updateCategory);

module.exports = { productsRouter };
