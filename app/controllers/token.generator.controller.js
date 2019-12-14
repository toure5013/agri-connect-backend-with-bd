const jwt = require('jsonwebtoken');
const config = require('../../utils/config/config.json');
const verifyTokenMiddleware = require('../middlewares/tokenVerificationMiddleware');
const signinController = require('./auth.controller');
const message = require('../../utils/config/messages.json').message;
const logger = require('../middlewares/logMiddleware').logMiddleware;
class tokenGenerator {
    loginVerification(req, res) {
        var loginState = signinController.login(req, res);

        loginState.then((loginStateResult) => {

            if(loginStateResult.error == false){
                    const secret = config.tokenkey;
                    let username = loginStateResult.username;
                    // let password = loginStateResult.password;
                    //Generation du token
                    const loginDate = new Date();
                    let token = jwt.sign(
                        {
                            username:username,
                            loginDate : loginDate
                        },
                        secret,
                        {
                            //additional parameters to token , le token est valable un jour
                            expiresIn : config.token_valid_time
                        });
                    //return the data to return to user after login
                    const user_info = {
                        id : loginStateResult.user.id,
                        email : loginStateResult.user.email,
                        username : loginStateResult.user.username,
                        firstname : loginStateResult.user.firstname,
                        lastname : loginStateResult.user.lastname,
                        birthday : loginStateResult.user.birthday,
                        picturename : loginStateResult.user.picturename, 
                    }
                    res.json({
                        error : false,
                        success : true,
                        status: 200,
                        message : message.success.login,
                        token: token,
                        role :  loginStateResult.user.role,
                        user_info : user_info
                    })
            }else{
                //-------------auth failed------------
                res.json({
                    error: true,
                    success: false,
                    status: 400,
                    message : loginStateResult.message
                })
            }
        }).catch((err) => {
            logger.error(JSON.stringify(err));
            console.log(JSON.stringify(err.message));
            res.json({
                error: true,
                success: false,
                status: 400,
                message : err.message,
            })
        })
    }


    index(req, res) {
        res.json({
            error: false,
            success : true,
            status : 200,
            message: "Bienvenue sur l'api v1"
        })
    }
}

module.exports = tokenGenerator;