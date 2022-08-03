// Models
const { Category } = require('../models/category.model');
const { Product } = require('../models/product.model');

// Utils
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

const categoryExists = catchAsync(async (req, res, next) => {
  const { categoryId } = req.body;

  let id;

  categoryId ? (id = categoryId) : (id = req.params.id);

  const category = await Category.findOne({
    where: { id },
    include: { model: Product, required: false, where: { status: 'active' } },
  });

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  req.category = category;
  next();
});

module.exports = { categoryExists };
