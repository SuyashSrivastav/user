var express = require("express");

var router = express.Router();

var token = require("./token")

const userController = require("./controller/UserController")

router.post("/register", userController.signUp)
router.post("/login", userController.signIn)
router.get("/details", token.verifyToken, userController.getUser)


module.exports = router;