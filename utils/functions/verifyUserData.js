// ./utils/functions/verifuUserData

//Require express validator to verify if all user data are correct
const expressValidator = require('express-validator')

/*---------------------------------------------------------
                    PERSONAL MODULE
//---------------------------------------------------------*/
const message = require('../config/messages.json').message



// console.log(message.error)
exports.verifyUserData = (
  firstname,
  lastname,
  username,
  birthday,
  email,
  password,
  passwordConfirm
) => {
  // We declare variable error with false, when an error occured we put to true
  //console.log('je verifie')
  var error = false
  if (
    firstname,
    lastname != ' ' &&
    username != ' ' &&
    birthday != ' ' &&
    email != ' ' &&
    password != ' ' &&
    passwordConfirm != ''
  ) {
    // username
    if (!username /* regexUsername */) {
      error = true
      return [
        error,
        {
          status: 400,
          message: 'ERROR  : ' + message.error.username_invalid
        }
      ]
    }
    // email
    if (!email /* regexEmail */) {
      error = true
      return [
        error,
        {
          status: 400,
          message: 'ERROR  : ' + message.error.invalid_email
        }
      ]
    }

    // password /* && password < 8 && RegexPassword */
    if (password === passwordConfirm) {
      // message d'erreur disant que les deux mots de pass ne correspondent pas
    error = true
    return [
      error,
      {
        status: 400,
        message: 'ERROR  : ' + message.error.blank
      }
    ]
    }

  } else {
    error = true
      return [
        error,
        {
          status: 400,
          message: 'ERROR  : ' + message.error.different_password
        }
      ]
  }

  return [
    error,
    {
      status: 200,
      message: 'SUCCESS  : ' + message.success.correct
    }
  ]
}
