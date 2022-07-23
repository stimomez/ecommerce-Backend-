const express = require('express');

// Controllers
const {
  createUser,
  updateUser,
  deleteUser,
  login,
  userProducts,
  getAllOrdersUser,
  getOrderById,
 
} = require('../controllers/users.controller');

// Middlewares
const {
  createUserValidators,
} = require('../middlewares/validators.middleware');

const { userExists } = require('../middlewares/users.middleware');

const {
  protectSession,
  protectUserAccount,
} = require('../middlewares/auth.middleware');
const { orderExists } = require('../middlewares/order.middleware');


const usersRouter = express.Router();

usersRouter.post('/', createUserValidators, createUser);

usersRouter.post('/login', login);

usersRouter.use(protectSession);

usersRouter.get('/me', userProducts);

usersRouter.get('/orders', getAllOrdersUser);
usersRouter.get('/orders/:id', orderExists, getOrderById);
usersRouter
  .use('/:id', userExists)
  .route('/:id')
  .patch(protectUserAccount, updateUser)
  .delete(protectUserAccount, deleteUser);

module.exports = { usersRouter };
