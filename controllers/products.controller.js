const dotenv = require('dotenv');

const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const { storage } = require('../utils/firebase.util');

const { Product } = require('../models/product.model');

const { catchAsync } = require('../utils/catchAsync.util');
const { Category } = require('../models/category.model');
const { ProductImg } = require('../models/productImg.model');
const { Op } = require('sequelize');

dotenv.config({ path: './config.env' });

const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    include: { model: ProductImg, attributes: ['id', 'imgUrl'] },
  });
  await Promise.all(
    products.map(async product => {
      await Promise.all(
        product.productImgs.map(async productImg => {
          const imgRef = ref(storage, productImg.imgUrl);

          const imgFullPath = await getDownloadURL(imgRef);

          productImg.imgUrl = imgFullPath;
        })
      );
    })
  );
  res.status(200).json({
    status: 'success',
    products,
  });
});

const getProducById = catchAsync(async (req, res, next) => {
  const { product } = req;

  const productImgsPromises = product.productImgs.map(async productImg => {
    const imgRef = ref(storage, productImg.imgUrl);

    const imgFullPath = await getDownloadURL(imgRef);

    productImg.imgUrl = imgFullPath;
  });

  await Promise.all(productImgsPromises);

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

const filterSearchProducts = catchAsync(async (req, res, next) => {
  const { search } = req.params;
  console.log(search);
  const products = await Product.findAll({
    where: {
      status: 'active',
      [Op.or]: [{ title: search }, { description: search }],
    },
    include: { model: ProductImg, attributes: ['id', 'imgUrl'] },
  });

  await Promise.all(
    products.map(async product => {
      await Promise.all(
        product.productImgs.map(async productImg => {
          const imgRef = ref(storage, productImg.imgUrl);

          const imgFullPath = await getDownloadURL(imgRef);

          productImg.imgUrl = imgFullPath;
        })
      );
    })
  );

  res.status(200).json({
    status: 'success',
    products,
  });
});

const getCategoryById = catchAsync(async (req, res, next) => {
  const { category } = req;

  if (category.products.length > 0) {
    await Promise.all(
      category.products.map(async product => {
        await Promise.all(
          product.productImgs.map(async productImg => {
            const imgRef = ref(storage, productImg.imgUrl);

            const imgFullPath = await getDownloadURL(imgRef);

            productImg.imgUrl = imgFullPath;
          })
        );
      })
    );
  }

  res.status(200).json({
    status: 'success',
    category,
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

  if (req.files.length > 0) {
    const filesPromises = req.files.map(async file => {
      const imgRef = ref(
        storage,
        `products/${Date.now()}_${file.originalname}`
      );

      const imgRes = await uploadBytes(imgRef, file.buffer);

      await ProductImg.create({
        productId: newProduct.id,
        imgUrl: imgRes.metadata.fullPath,
      });
    });

    await Promise.all(filesPromises);
  }

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
  getCategoryById,
  filterSearchProducts,
};
