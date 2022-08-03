const { User } = require('../models/user.model');
const { Order } = require('../models/order.model');
const { Cart } = require('../models/cart.model');
const { Product } = require('../models/product.model');
const { ProductInCart } = require('../models/productInCart.model');
const { Category } = require('../models/category.model');
const { ProductImg } = require('../models/productImg.model');

const initModels = () => {
  User.hasMany(Order);
  Order.belongsTo(User);

  User.hasOne(Cart);
  Cart.belongsTo(User);

  User.hasMany(Product);
  Product.belongsTo(User);

  Order.hasOne(Cart);
  Cart.belongsTo(Order);

  Cart.hasMany(ProductInCart);
  ProductInCart.belongsTo(Cart);

  Product.hasOne(ProductInCart);
  ProductInCart.belongsTo(Product);

  Category.hasMany(Product);
  Product.belongsTo(Category);

  Category.hasOne(ProductInCart);
  ProductInCart.belongsTo(Category);

  Product.hasMany(ProductImg);
  ProductImg.belongsTo(Product);
};

module.exports = { initModels };
