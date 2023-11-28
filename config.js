const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;

const DB_PORT = process.env.DB_PORT
const DB = process.env.DB;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const JWT_SECRET = process.env.JWT_SECRET;

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_STORAGE = process.env.FIREBASE_STORAGE;
const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID;

const MAILTRAP_USER = process.env.MAILTRAP_USER;
const MAILTRAP_PASSWORD = process.env.MAILTRAP_PASSWORD;
const MAIL_FROM = process.env.MAIL_FROM;

module.exports = {
  NODE_ENV,
  PORT,
  DB_PORT,
  DB,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  JWT_SECRET,
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_STORAGE,
  FIREBASE_PROJECT_ID,
  MAILTRAP_USER,
  MAILTRAP_PASSWORD,
  MAIL_FROM,
 
};
