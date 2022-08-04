const { Cart } = require('../models/cart.model');
const { Order } = require('../models/order.model');
const { Product } = require('../models/product.model');
const { ProductInCart } = require('../models/productInCart.model');
const { User } = require('../models/user.model');
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

const orderExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;
  const status = 'active';

  const order = await Order.findOne({
    where: { id, userId: sessionUser.id, status },
    include: {
      model: User,
      attributes: ['id', 'userName'],
      include: {
        model: Cart,
        attributes: ['id', 'status'],
        where: { status: 'purchased' },
        include: {
          model: ProductInCart,
          attributes: ['id', 'quantity'],
          where: { status: 'purchased' },
          include: {
            model: Product,
            attributes: ['id', 'categoryId', 'title','price'],
          },
        },
      },
    },
  });

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  req.order = order;
  next();
});

module.exports = {
  orderExists,
};
