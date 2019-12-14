const {sequelize} = require('./db')

    /*----------------------------------------------------------
                           //connection test
    ------------------------------------------------------------*/  
sequelize
.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
  
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});


