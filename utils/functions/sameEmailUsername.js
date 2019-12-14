const logger = require('../../app/middlewares/logMiddleware').logMiddleware;
const userDbRequest = require('../../database/query/User.request');


var sameEmail = false;
var sameUsername = false;


//select user
userDbRequest.findOneById(userId)
.then( //if all is ok
  user => {
    if(user.username == username){
       sameEmail = true
    }
    if(user.email == email){
      sameUsername = true;
    }
  }).catch((e) => { //if err
  res.json({
    error : true,
    success : false,
    status: 500,
    message: "Error :" + e
  });
});