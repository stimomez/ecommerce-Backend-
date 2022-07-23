const { Product } = require('../models/product.model');
const { ProductInCart } = require('../models/productInCart.model');

const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

const productExists = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  let id;

  productId ? (id = productId) : (id = req.params.id);

  const product = await Product.findOne({ where: { id, status: 'active' } });
 
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  req.product = product;
  next();
});

const protectProductAuthor = catchAsync(async (req, res, next) => {
  const { sessionUser, product } = req;

  if (sessionUser.id !== product.userId) {
    return next(
      new AppError('You are not the author user of this product.', 403)
    );
  }
  next();
});

module.exports = { productExists, protectProductAuthor };
