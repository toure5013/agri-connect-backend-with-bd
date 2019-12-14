const {sequelize, Sequelize} = require('../../database/db');

    /*----------------------------------------------------------
                    //Modeling user table
    ------------------------------------------------------------*/  

const User = sequelize.define('user', {
    // attributes
    firstname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastname: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
    username: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
    birthday: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
    email: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
    password: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
    picturename: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
    role : {
      type: Sequelize.BOOLEAN,
      defaultValue: 0
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
  }, {
    // options
  })

  module.exports = {
      User
  }
