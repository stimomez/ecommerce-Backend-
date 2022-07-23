const { app } = require('./app');
const { db } = require('./utils/database.util');
const { initModels } = require('./utils/initModel.util');

db.authenticate()
  .then(() => console.log('Db authenticated'))
  .catch(err => console.log(err));

initModels();

db.sync()
  .then(() => console.log('Db synced'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 3520;

app.listen(PORT, () => console.log('Express app running!!!', PORT));
