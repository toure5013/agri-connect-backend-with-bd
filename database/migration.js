/*-----------------------------------------------
                FOR CREATE TABLES
----------------------------------------------- */

const connexion = require('./connexiondb'); //connexion to database
const { User } = require('../app/models/User'); //Users models
const { Token } = require('../app/models/Token'); //Users models

 
 // Note: using `force: true` will drop the table if it already exists
exports.userMigration = User.sync(/*{ force: true }*/).then(() => {
  // Now the `users` table in the database corresponds to the model definition
  console.log("User table create with success");
  return {
      status : 200,
      message : "Table user create with successs"
  }
});

 // Note: using `force: true` will drop the table if it already exists
 exports.tokenMigration = Token.sync({ force: true }).then(() => {
  // Now the `users` table in the database corresponds to the model definition
  console.log("Token table create with success");
  return {
      status : 200,
      message : "Token table create with success"
  }
});