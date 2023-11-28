const { PORT, DB_USER, DB_HOST } = require('../config');
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

const PORTAPI = PORT || 3520;

console.log(PORT);

console.log(DB_USER);
console.log(DB_HOST);

app.listen(PORTAPI, () => console.log('Express app running!!!', PORTAPI));
