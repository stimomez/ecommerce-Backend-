const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { User } = require('../models/user.model');

const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');
const { ProductInCart } = require('../models/productInCart.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');

dotenv.config({ path: './config.env' });

const addProductToCart = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;
  const { product, cart } = req;

  if (quantity <= 0 || quantity > product.quantity) {
    return next(new AppError('Quantity not available of the product', 400));
  }

  const productInCart = await ProductInCart.findOne({
    where: { productId: product.id },
  });

  if (productInCart) {
    if (productInCart.status === 'active') {
      return next(new AppError('This product has already been added', 404));
    } else {
      const newProductIncart = await productInCart.update({
        status: 'active',
        quantity,
      });

      res.status(201).json({
        status: 'success',
        newProductIncart,
      });
    }
  }

  const newProductIncart = await ProductInCart.create({
    cartId: cart.id,
    productId: product.id,
    quantity,
  });

  res.status(201).json({
    status: 'success',
    newProductIncart,
  });
});

const updateProductCart = catchAsync(async (req, res, next) => {
  const { newQty } = req.body;
  const { product, cartUser } = req;

  const productInCart = await ProductInCart.findOne({
    where: { productId: product.id, cartId: cartUser.id },
  });

  if (!productInCart) {
    return next(new AppError('productInCart not found', 404));
  }

  if (newQty < 0 || newQty > product.quantity) {
    return next(new AppError('Quantity not available of the product', 400));
  }

  if (newQty === 0) {
    await productInCart.update({ quantity: newQty, status: 'removed' });
  }
  if (newQty > 0) {
    await productInCart.update({ quantity: newQty });
  }

  res.status(204).json({ status: 'success' });
});

const removeProductCart = catchAsync(async (req, res, next) => {
  const { productInCart } = req;
  await productInCart.update({ quantity: 0, status: 'removed' });

  res.status(204).json({ status: 'success' });
});

const makePurchaseProductInCart = catchAsync(async (req, res, next) => {
  const { cartUser } = req;
  const listPurchasedProduct = [];
  const priceListPurchasedProducts = [];
  let totalPriceCart = 0;

  const productsInCart = await ProductInCart.findAll({
    where: { cartId: cartUser.id, status: 'active' },
  });

  await Promise.all(
    productsInCart.map(async productInCart => {
      const product = await Product.findOne({
        where: { id: productInCart.productId, status: 'active' },
      });

      listPurchasedProduct.push(product);

      priceListPurchasedProducts.push(productInCart.quantity);

      const subtraction = product.quantity - productInCart.quantity;

      await product.update({ quantity: subtraction });

      if (product.quantity < 1) {
        await product.update({ status: 'soldOut' });
      }

      const totalProductCart = product.price * productInCart.quantity;

      totalPriceCart = totalPriceCart + totalProductCart;

      await productInCart.update({ status: 'purchased' });
    })
  );

  await cartUser.update({ status: 'purchased' });


  const order = await Order.create({
    userId: cartUser.userId,
    cartId: cartUser.id,
    totalPrice: totalPriceCart,
  });

  res.status(200).json({
    status: 'success',
    order,
  });
});

module.exports = {
  addProductToCart,
  updateProductCart,
  removeProductCart,
  makePurchaseProductInCart,
};
