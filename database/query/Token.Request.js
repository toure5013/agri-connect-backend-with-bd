const connexion = require('../connexiondb'); //connexion to database
const {
    Token
} = require('../../app/models/Token'); //Tokens models

/*-------------------------------------------------------
                    Create table
      uncomment this line under to create table
-------------------------------------------------------*/
// const migrate = require('../migration');


/*-------------------------------------------------------
                        Request
-------------------------------------------------------*/
// Find all users
const findAll = () => {
    return Token.findAll();
}

// Find one user with id
const findOneToken = (token) => {
        return Token.findOne({
            where: {
                token: token
            }
        });
}




// Create a new user
const insert = (username, token) => {
    return Token.create({
        username: username,
        token: token
    });
}

// Delete everyone with his id
const destroy = (idOrToken) => {
    if (isNaN(id)) {
        return Token.destroy({
            where: {
                token: idOrToken
            }
        });
    } else {
        return Token.destroy({
            where: {
                id: idOrToken
            }
        });
    }

}

module.exports = {
    insert,
    findOneToken,
    findAll,
    destroy
}