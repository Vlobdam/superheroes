const db = require('../db/init');
const { getDatabase } = require("firebase-admin/database");

db.init();

const rtdb = getDatabase();

module.exports = (req, _, next) => {
  req.db = rtdb;
  next();
}