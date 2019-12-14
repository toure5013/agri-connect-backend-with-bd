// Bcrypt to hash user password
const bcrypt = require('bcrypt')
const message = require('../../utils/config/messages.json').message

const logger = require('../middlewares/logMiddleware').logMiddleware
const userDbRequest = require('../../database/query/User.request')
const tokenDbRequest = require('../../database/query/Token.request')

var dataReturn = {}

exports.login = (req, res) => {
  console.log(req.body)
  var username = req.body.username || req.body.email
  var password = req.body.password
  return new Promise((resolve, reject) => {
    userDbRequest
      .findOneByUsername(username)
      .then(
        // if all is ok
        user => {
          if (user) {
            const userPasswordFromDataBase = user.password
            console.log(userPasswordFromDataBase)
            bcrypt.compare(
              password,
              userPasswordFromDataBase /* this is the password get from database */,
              (err, result) => {
                if (result) {
                  dataReturn = {
                    error: false,
                    status: 200,
                    username: username,
                    password: userPasswordFromDataBase,
                    user: user,
                    message: 'SUCCESS : ' + message.success.login
                  }
                  resolve(dataReturn)
                } else {
                  dataReturn = {
                    error: true,
                    status: 404,
                    message: 'ERROR : Mot de pass ne correspond pas'
                  }
                  resolve(dataReturn)
                }
              }
            )
          } else {
            console.log('something went wrong')
            dataReturn = {
              error: true,
              status: 404,
              message: 'ERROR : User not found'
            }
            resolve(dataReturn)
          }
        }
      )
      .catch(e => {
        // if err
        console.log('something went wrong')
        dataReturn = {
          error: true,
          status: 404,
          message: 'ERROR : User not found'
        }
        resolve(dataReturn)
      })
  })
}

exports.logout = (req, res, next) => {
  const { username, token } = req.body
  tokenDbRequest
    .insert(username, token)
    .then(
      // if all is ok
      result => {
        if (result) {
          res.json({
            error: true,
            success: false,
            status: 200,
            message: 'Token depreciated with success'
          })
        } else {
          res.json({
            error: true,
            success: false,
            status: 400,
            message: 'ERROR : Token not added'
          })
        }
      }
    ).catch(e => {
      // if err
      res.json({
        error: true,
        success: false,
        status: 400,
        message: 'ERROR : ' + JSON.stringify(e)
      })
    });
}
