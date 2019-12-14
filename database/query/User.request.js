const connexion = require('../connexiondb'); //connexion to database
const {
  User
} = require('../../app/models/User'); //Users models

/*-------------------------------------------------------
                    Create table
      uncomment this line under to create table
-------------------------------------------------------*/
//  const migrate = require('../migration');


/*-------------------------------------------------------
                        Request
-------------------------------------------------------*/
// Find all users
const findAll = () => {
  return User.findAll();
}

// Find one user with id
const findOneById = (Userid) => {
  return User.findOne({
      where: {
        id: Userid
      }
    });
}

// Find one user with username
const findOneByUsername = (username) => {
  return User.findOne({
      where: {
        username: username
      } 
    });
}

// Find one user with email
const findOneByEmail = (email) => {
  return User.findOne({
      where: {
        email: email
      } 
    });
}


// Create a new user
const insert = (firstname, lastname, username, birthday, email, passwordHashed, picturename) => {
  return User.create({
    firstname: firstname,
    lastname: lastname,
    username: username,
    birthday: birthday,
    email: email,
    password: passwordHashed,
    picturename: picturename,
  });
}

// Delete everyone with his id
const destroy = (id) => {
  return User.destroy({
    where: {
      id: id
    }
  });
}

// Change everyone without a last name to "Doe"
const update = (id, firstname, lastname, username, birthday, email, passwordHashed, picturename) => {
  return User.update({
    firstname: firstname,
    lastname: lastname,
    username: username,
    birthday: birthday,
    email: email,
    password: passwordHashed,
    picturename: picturename,
  }, {
    where: {
      id: id
    }
  });
}

module.exports = {
  insert,
  findOneById,
  findOneByUsername,
  findOneByEmail,
  findAll,
  update,
  destroy
}