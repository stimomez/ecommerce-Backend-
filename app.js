const express = require('express');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

const helmet = require('helmet');

const { globalErrorHandler } = require('./controllers/error.controller');

const { AppError } = require('./utils/appError.util');

const { usersRouter } = require('./routes/users.routes');
const { productsRouter } = require('./routes/products.routes');
const { cartRouter } = require('./routes/cart.routes');

const app = express();

app.use(express.json());

const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000, //1hr
  message: 'Number of request have been exceeded',
});

app.use(limiter);

app.use(helmet());

app.use(compression());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
else app.use(morgan('combined'));

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/cart', cartRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `${req.method} ${req.originalUrl} not found in this server`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = { app };
