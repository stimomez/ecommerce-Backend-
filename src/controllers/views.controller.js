const { catchAsync } = require('../utils/catchAsync.util');

const renderIndex = catchAsync(async (req, res, next) => {
  res.status(200).render('index');
});

module.exports = { renderIndex };
