const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { User } = require('../models/user.model');
const { Order } = require('../models/order.model');
const { Product } = require('../models/product.model');

const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');
const { Email } = require('../utils/email.util');
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');
const { async } = require('@firebase/util');

dotenv.config({ path: './config.env' });

const createUser = catchAsync(async (req, res, next) => {
  const { userName, email, password, role } = req.body;

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    userName,
    email,
    role,
    password: hashPassword,
  });

  // Remove password from response
  newUser.password = undefined;

  await new Email(newUser.email).sendWelcome(newUser.userName);

  res.status(201).json({
    status: 'success',
    newUser,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { userName, email } = req.body;

  await user.update({ userName, email });

  res.status(204).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'disable' });

  res.status(204).json({ status: 'success' });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate credentials (email)
  const user = await User.findOne({
    where: {
      email,
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError('Credentials invalid', 400));
  }

  // Validate password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return next(new AppError('Credentials invalid', 400));
  }

  // Generate JWT (JsonWebToken) ->
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  // Send response
  res.status(200).json({
    status: 'success',
    token,
  });
});

const getAllOrdersUser = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = sessionUser;
  const orderWithYourProducts = [];

  const orders = await Order.findAll({
    where: { userId: id },
  });

  for (let i = 0; i < orders.length; i++) {
    const cartId = orders[i].cartId;
    const productInCart = await ProductInCart.findAll({
      where: { cartId, status: 'purchased' },
      order: [['updatedAt', 'DESC']],
      attributes: ['id', 'cartId', 'quantity', 'status'],
      include: {
        model: Product,
        attributes: {
          exclude: 'createdAt updatedAt userId categoryId status ',
        },
      },
    });
    if (productInCart.length > 0) {
      // for (let j = 0; j < productInCart.length; j++) {

      orderWithYourProducts.push({
        order: orders[i],
        productInCart: productInCart,
      });

      // }
    }
  }

  res.status(200).json({
    status: 'success',
    orderWithYourProducts,
  });
});

const getOrderById = catchAsync(async (req, res, next) => {
  const { order } = req;
  const orderWithYourProducts = [];
  const productInCart = await ProductInCart.findOne({
    where: { cartId: order.cartId, status: 'purchased' },
    include: { model: Product },
  });
  orderWithYourProducts.push({ order: order, productInCart: productInCart });

  res.status(200).json({
    status: 'success',
    orderWithYourProducts,
  });
});

const userProducts = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const product = await Product.findAll({ where: { userId: sessionUser.id } });

  res.status(200).json({
    product,
  });
});

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  login,
  userProducts,
  getAllOrdersUser,
  getOrderById,
};
