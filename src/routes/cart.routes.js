const express = require('express');

const { protectSession } = require('../middlewares/auth.middleware');
const {
  addProductToCart,
  updateProductCart,
  removeProductCart,
  makePurchaseProductInCart,
  getAllCart,
} = require('../controllers/cart.controller');
const {
  cartActivated,
  cartExists,
  productInCart,
} = require('../middlewares/cart.middleware');
const { productExists } = require('../middlewares/product.middleware');
const {
  validatorsAddProductToCart,
} = require('../middlewares/validators.middlewares');

const cartRouter = express.Router();

cartRouter.use(protectSession);

cartRouter.get('/products-cart', cartExists, getAllCart);

cartRouter.post(
  '/add-product',
  validatorsAddProductToCart,
  productExists,
  cartActivated,
  addProductToCart
);

cartRouter.patch('/update-cart', productExists, cartExists, updateProductCart);

cartRouter.delete('/:productId', cartExists, productInCart, removeProductCart);

cartRouter.post('/purchase', cartExists, makePurchaseProductInCart);

module.exports = { cartRouter };
