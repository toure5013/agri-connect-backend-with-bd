const {
    sequelize,
    Sequelize
} = require('../../database/db');

/*----------------------------------------------------------
                //Modeling Token table
------------------------------------------------------------*/

const Token = sequelize.define('token', {
    // attributes
    username: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    token: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    depreciated: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
    },
    createdAt: {
        allowNull: false,
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        allowNull: false,
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
});

module.exports = {
    Token
}