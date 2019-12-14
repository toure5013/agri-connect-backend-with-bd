// Bcrypt to hash user password
const path = require("path");
const bcrypt = require("bcrypt");

// Personal mod ules
const message = require("../../utils/config/messages").message;
const verifyData = require("../../utils/functions/verifyUserData");
const {
  imageUploadFunction
} = require("../../utils/functions/uploadImage");
const logger = require("../middlewares/logMiddleware").logMiddleware;
const userDbRequest = require("../../database/query/User.request");
const checkUserByUsernameAndEmail = require("../../utils/functions/checkUserByUsernameAndEmail");

//Variables
const imageFolderName = "profil_picture";
const date = new Date();

/*---------------------------------------------------------------------------
                      // Add(Create) One User
---------------------------------------------------------------------------*/
exports.addOneUser = async (req, res, next) => {
  const data = req.body;
  console.log(data);
  // user all info
  const firstname = data.firstname;
  const lastname = data.lastname;
  const username = data.username;
  const birthday = data.birthday;
  const email = data.email;
  const password = data.password;
  const passwordConfirm = data.passwordConfirm;

  // verifyData : we use function to check if all of user data sent by user are OK
  const dataVerificationReturn = await verifyData.verifyUserData(
    req, 
    res,
    firstname,
    lastname,
    username,
    birthday,
    email,
    password,
    passwordConfirm
  );

  // A dataVerificationReturn: if all we verify the image using imageUploadFunction();

  if (dataVerificationReturn[0] == false) {
    //We check if username or email isn't already took
    const emailCheckReturn = checkUserByUsernameAndEmail.checkUserByEmail(
      email
    );
    const usernameCheckReturn = checkUserByUsernameAndEmail.checkUserByUsername(
      username
    );
    emailCheckReturn
      .then(emailExistReturn => {
        console.log(emailExistReturn);
        if (!emailExistReturn) {
          //email not taken
          usernameCheckReturn
            .then(usernameExistReturn => {
              console.log(usernameExistReturn);
              if (!usernameExistReturn) {
                //username not taken
                // call a function to verify image sent by user after check the result
                var dataImageSaveReturn = imageUploadFunction(
                  req,
                  res,
                  imageFolderName
                );
                //We check the dataImageSaveReturn here
                dataImageSaveReturn
                  .then(result => {
                    if (result[0] == false) {
                      //If all is ok with our image we get the picture name, salt password and save user
                      const picturename =
                        imageFolderName + "/" + result[1].picturename;
                      var passwordHashed = bcrypt.hashSync(password, 10);
                      //Save this data in database
                      userDbRequest
                        .insert(
                          firstname,
                          lastname,
                          username,
                          birthday,
                          email,
                          passwordHashed,
                          picturename
                        )
                        .then(
                          //if all is ok
                          user => {
                            console.log("User's auto-generated ID:", user.id);
                            res.status(200).json({
                              status: 200,
                              message: message.success.save,
                              date: date,
                            });
                          }
                        )
                        .catch(e => {
                          //if err
                          res.status(500).json({
                            status: 500,
                            message: "Error :" + e,
                          });
                        });
                    } else {
                      // Something went wrong when trying to save image get the error message to return to user
                      logger.error(JSON.stringify(result));
                      res.send(result);
                    }
                  })
                  .catch(e => {
                    res.status(500).send("Error" + JSON.stringify(e));
                  });
              } else {
                //User username exist
                res.status(400).json({
                  status: 400,
                  message: "Username already exist",
                });
              }
            })
            .catch(e => {
              /*Something went wrong */
              res.status(400).json({
                status: 400,
                message: JSON.stringify(e),
              });
            });
        } else {
          /*User email exist */
          res.status(400).json({
            status: 400,
            message: "Email Already exist",
          });
        }
      })
      .catch(() => {
        /*Something went wrong */
        res.status(400).json({
          status: 400,
          message: "Email Already exist",
        });
      });
  } else {
    //end dataVerificationReturn
    var error = dataVerificationReturn;
    res.status(400).json({
      status: 400,
      message: error,
    });
  }
}; //end addOneUser

/*---------------------------------------------------------------------------
                             // Get All users
---------------------------------------------------------------------------*/

exports.getAllUser = (req, res) => {
  //logger
  //Select All user
  userDbRequest
    .findAll()
    .then(
      //if all is ok
      users => {
        logger.info("get All user with success");
        res.status(200).json({
          success: true,
          status: 200,
          users: users,
        });
      }
    )
    .catch(e => {
      //if err
      res.status(500).json({
        success: false,
        status: 500,
        message: "Error :" + e,
      });
    });
};

/*---------------------------------------------------------------------------
                            // Get One User
---------------------------------------------------------------------------*/

exports.getOneUser = (req, res) => {
  // id of user to return (Here we can get user by using his username or his id or his email make SQL request whom can take one of all this params)
  const userId = req.params.userId;
  //logger
  logger.info("get user " + userId);
  //Select the user by id from database
  userDbRequest
    .findOneById(userId)
    .then(
      //if all is ok
      user => {
        res.status(200).json({
          success: true,
          status: 200,
          user : {
            id : user.id,
            email : user.email,
            username : user.username,
            firstname : user.firstname,
            lastname : user.lastname,
            birthday : user.birthday,
            picturename : user.picturename, 
            role : user.role
          }
        });
      }
    )
    .catch(e => {
      //if err
      res.status(500).json({
        success: false,
        status: 500,
        message: "Error :" + e,
      });
    });
};

/*---------------------------------------------------------------------------
                              // Update One User
---------------------------------------------------------------------------*/
exports.updateOneUser = async (req, res, next) => {
  //The user id
  const userId = req.params.userId;

  // user all info
  const data = req.body;
  const firstname = data.firstname;
  const lastname = data.lastname;
  const username = data.username;
  const birthday = data.birthday;
  const email = data.email;
  const password = data.password;
  const passwordConfirm = data.passwordConfirm;

  // verifyData : we use function to check if all of user data sent by user are OK
  const dataVerificationReturn = await verifyData.verifyUserData(
    req,
    res,
    firstname,
    lastname,
    username,
    birthday,
    email,
    password,
    passwordConfirm
  );

  // A dataVerificationReturn: if all we verify the image using imageUploadFunction();
  if (dataVerificationReturn[0] == false) {
    //Get all user info and check if user with this id exist or not
    const user = await userDbRequest.findOneById(userId);
    console.log(user);
    if (!user) {
      res.status(400).json({
        success: false,
        status: 400,
        message: "Utilisateur avec cet id n'existe pas",
      });
    } else {
      //We check if username or email isn't already took
      const emailCheckReturn = await checkUserByUsernameAndEmail.checkUserByEmail(
        email
      );
      const usernameCheckReturn = await checkUserByUsernameAndEmail.checkUserByUsername(
        username
      );
      //We check if one of email or/and username are the same with new  email and username
      const sameEmail = user.email == email ? true : false;
      const sameUserName = user.username == username ? true : false;

      console.log(sameEmail, sameUserName);

      var emailOk = true;
      var usernameOk = true;

      //We check if all is ok with email
      if (emailCheckReturn) {
        //email exit
        if (sameEmail) {
          /*the same email with the user email*/
          emailOk = true;
        } else {
          /*Email  already taken*/
          emailOk = false;
          res.status(400).json({
            success: false,
            status: 400,
            message: "email deja pris par un autre utilisateur",
          });
        }
      }
      //We check if all is ok with username
      if (usernameCheckReturn) {
        //username exit
        if (sameUserName) {
          /*the same username with the user username*/
          usernameOk = true;
        } else {
          //Email  already taken
          console.log("username deja pris par un autre utilisateur");
          usernameOk = false;
          res.status(400).json({
            success: false,
            status: 400,
            message: "username deja pris par un autre utilisateur",
          });
        }
      }
      if (usernameOk && emailOk) {
        // call a function to verify image sent by user after check the result
        var dataImageSaveReturn = imageUploadFunction(
          req,
          res,
          imageFolderName
        );
        //We check the dataImageSaveReturn here
        dataImageSaveReturn
          .then(result => {
            if (result[0] == false) {
              //If all is ok with our image we get the picture name and save
              const picturename = imageFolderName + "/" + result[1].picturename;
              var passwordHashed = bcrypt.hashSync(password, 10);
              //logger
              logger.info(JSON.stringify(result));
              /*-------------------------------------------------
                                    save in database
                  --------------------------------------------------*/
              //Update the user by id from database
              userDbRequest
                .update(
                  userId,
                  firstname,
                  lastname,
                  username,
                  birthday,
                  email,
                  passwordHashed,
                  picturename
                )
                .then(
                  //if all is ok
                  user => {
                    logger.info(
                      "User  id : " + userId + message.success.update
                    );
                    res.status(200).json({
                      success: true,
                      status: 200,
                      user: user,
                      new_data: {
                        firstname,
                        lastname,
                        username,
                        birthday,
                        email,
                        password,
                      },
                      message: message.success.update,
                    });
                  }
                )
                .catch(e => {
                  //if err
                  res.status(500).json({
                    success: false,
                    status: 500,
                    message: "Error :" + JSON.stringify(e),
                  });
                });
            } else {
              // Something went wrong when trying to save image get the error message to return to user
              logger.error(JSON.stringify(result));
              res.status(500).json({
                success: false,
                message: JSON.stringify(result)
              });
            }
          })
          .catch(e => {
            res.status(500).json({
              success: false,
              message: JSON.stringify(e)
            });
          });
      }
    }
  } else {
    var error = dataVerificationReturn;
    res.status(400).json({
      success: false,
      status: 400,
      message: JSON.stringify(error),
    });
  }
};

/*---------------------------------------------------------------------------
                            // Delete One User
---------------------------------------------------------------------------*/
exports.deleteOneUser = (req, res) => {
  userId = req.params.userId;
  //We check if the user exist if yes we delete else we return unexisting message
  userDbRequest
    .findOneById(userId)
    .then(
      //we are checking here if user exist
      user => {
        userDbRequest
          .destroy(userId)
          .then(user => {
            if (user) {
              //If user exist delete from database
              userDbRequest
                .destroy(userId)
                .then(
                  //if all is ok
                  user => {
                    res.status(200).json({
                      success: true,
                      status: 200,
                      message: "id  = " + userId + " ... " + message.success.delete,
                    });
                  }
                )
                .catch(e => {
                  //if err
                  res.status(500).json({
                    success: false,
                    status: 500,
                    message: "Error :" + e,
                  });
                });
            } else {
              //if he isn't exist
              res.status(404).json({
                success: false,
                status: 404,
                message: "id  = " + userId + " ... " + message.error.user_not_found,
              });
            }
          })
          .catch(e => {
            //if err
            res.status(500).json({
              success: false,
              status: 500,
              message: "Error :" + e,
            });
          });
      }
    )
    .catch(e => {
      //if err
      res.status(500).json({
        success: false,
        status: 500,
        message: "Error :" + e,
      });
    });
};