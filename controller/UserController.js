const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require("mongoose");
const baseController = require("./BaseController");
const redis = require("../Redis")

const userService = require("../services/UserService")
const token = require("../token");
const { update } = require('../models/User');

const signUp = async (req, res, next) => {

    let errMsg = "error";
    let errCode = 404;
    let name = req.body.name
    let email = req.body.email
    let password = req.body.password
    if (name && password) {
        let userData = await userService.get({ name: name }).catch(e => next(e))
        if (userData && userData.length > 0) {
            errMsg = "username_exists"
            res.send(baseController.generateResponse(errCode, errMsg));
        }
        else {
            //new user
            console.log("new user");

            let userObj = {
                name: name,
                password: password,
                email: email,
                created_at: new Date()
            }
            let created = await userService.create(userObj).catch(e => next(e));

            if (created && JSON.stringify(created) !== '{}') {
                /* generate token */
                let tokenFound = await token.getSignedToken({ id: created._id }).catch(e => next(e))


                await redis.set((created._id).toString(), tokenFound).catch(e => next(e))

                await userService.update({ _id: created._id },
                    { $push: { previous_login_info_array: { $each: [{ token: tokenFound, login_date: new Date() }], $position: 0 } } })

                errMsg = "success";
                errCode = 0;
                res.send(baseController.generateResponse(errCode, errMsg, {
                    user: created,
                    token: tokenFound ? tokenFound : '',
                    current_login_time: new Date()
                }));
            }
            else {
                res.send(baseController.generateResponse(errCode, errMsg));
            }
        }
    }
    else {
        res.send(baseController.generateResponse(errCode, errMsg));
    }
}

const signIn = async (req, res, next) => {

    let errMsg = "not-found";
    let errCode = 404;

    let name = req.body.name
    let password = req.body.password


    let userData = await userService.get({ name: name, password: password }).catch(e => next(e))
    if (userData && userData.length > 0) {
        /* generate token */
        tokenFound = await token.increaseExpiration({ id: userData[0]._id }).catch(e => next(e))

        await redis.set((userData[0]._id).toString(), tokenFound).catch(e => next(e))


        await userService.update({ _id: userData[0]._id },
            { $push: { previous_login_info_array: { $each: [{ token: tokenFound, login_date: new Date() }], $position: 0 } } })

        errMsg = "success";
        errCode = 0;
        res.send(baseController.generateResponse(errCode, errMsg, {
            user: userData[0],
            token: tokenFound,
            current_login_time: new Date()
        }));
    }
    else {
        res.send(baseController.generateResponse(errCode, errMsg));
    }
}


const getUser = async (req, res, next) => {

    let errMsg = "error";
    let errCode = 404;

    let userId = req.user_data.id


    let userData = await userService.get({ _id: userId }).catch(e => next(e))
    if (userData && userData.length > 0) {
        /* generate token */
        tokenFound = await redis.get((userData[0]._id).toString()).catch(e => next(e))

        errMsg = "success";
        errCode = 0;
        res.send(baseController.generateResponse(errCode, errMsg, { user: userData[0], token: tokenFound }));
    }
    else {
        res.send(baseController.generateResponse(errCode, errMsg));
    }
}




module.exports = {
    signIn,
    signUp,
    getUser
}