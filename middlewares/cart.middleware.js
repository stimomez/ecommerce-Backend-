const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

const cartExists = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: 'active' },
  });

  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  req.cartUser = cart;
  next();
});

const cartActivated = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  let activeCart = await Cart.findOne({
    where: { userId: sessionUser.id, status: 'active' },
  });

  if (!activeCart) {
    const newCart = await Cart.create({
      userId: sessionUser.id,
    });
    activeCart = newCart;
  }

  req.cart = activeCart;
  next();
});

const productInCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { cartUser } = req;

  const productInCart = await ProductInCart.findOne({
    where: { productId, cartId: cartUser.id, status: 'active' },
  });

  if (!productInCart) {
    return next(new AppError('productInCart not found', 404));
  }

  req.productInCart = productInCart;
  next();
});

module.exports = { cartActivated, cartExists, productInCart };
