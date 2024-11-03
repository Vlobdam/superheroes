const admin = require("firebase-admin");
const serviceAccount = require(`../../${process.env.FIREBASE_CREDENTIALS}`);

function init(){
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DB_URL
  });
}

module.exports = {
  init,
}