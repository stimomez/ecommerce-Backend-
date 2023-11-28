const { Sequelize, DataTypes } = require('sequelize');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB, NODE_ENV } = require('../../config');



const db = new Sequelize({
  dialect: 'postgres',
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB,
  logging: false,
  dialectOptions:
    NODE_ENV === 'production'
      ? {
          ssl: {
            required: true,
            rejectUnauthorized: false,
          },
        }
      : {},
});

module.exports = { db, DataTypes };
