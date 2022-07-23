const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { Product } = require('../models/product.model');

const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');
const { Category } = require('../models/category.model');

dotenv.config({ path: './config.env' });

const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({ where: { status: 'active' } });

  res.status(200).json({
    status: 'success',
    products,
  });
});

const getProducById = catchAsync(async (req, res, next) => {
  const { product } = req;

  res.status(200).json({
    status: 'success',
    product,
  });
});


const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll({ where: { status: 'active' } });

  res.status(200).json({
    status: 'success',
    categories,
  });
});

const createProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, categoryId, quantity } = req.body;
  const { sessionUser } = req;

  const newProduct = await Product.create({
    title,
    description,
    price,
    categoryId,
    quantity,
    userId: sessionUser.id,
  });

  res.status(201).json({
    status: 'success',
    newProduct,
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { title, description, price, quantity } = req.body;

  await product.update({
    title,
    description,
    price,
    quantity,
  });

  res.status(204).json({ status: 'success' });
});

const disableProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: 'disabled' });

  res.status(204).json({ status: 'success' });
});

const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const newCategory = await Category.create({
    name,
  });

  res.status(201).json({
    status: 'success',
    newCategory,
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { category } = req;
  const { name } = req.body;

  await category.update({ name });

  res.status(204).json({ status: 'success' });
});

module.exports = {
  getAllProducts,
  getProducById,
  getAllCategories,
  createProduct,
  updateProduct,
  disableProduct,
  createCategory,
  updateCategory,
};
