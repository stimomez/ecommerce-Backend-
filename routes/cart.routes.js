const express = require('express');

// Controllers

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
  addProductToCart,
  updateProductCart,
  removeProductCart,
  makePurchaseProductInCart,
} = require('../controllers/cart.controller');
const {
  cartActivated,
  cartExists,
  productInCart,
} = require('../middlewares/cart.middleware');
const {
  productExists,
  productInCartExist,
} = require('../middlewares/product.middleware');

const cartRouter = express.Router();

cartRouter.use(protectSession);

cartRouter.post('/add-product', productExists, cartActivated, addProductToCart);

cartRouter.patch('/update-cart', productExists, cartExists, updateProductCart);

cartRouter.delete('/:productId', productInCart, removeProductCart);

cartRouter.post('/purchase', cartExists, makePurchaseProductInCart);

module.exports = { cartRouter };
