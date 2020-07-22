const fs = require("fs");
const jwt = require("jsonwebtoken");

const JWT_PRIVATE_KEY = fs.readFileSync("./private.key");

let expiration_day = 1

const signOptions = {
  issuer: "Accubits User",
  subject: "Validate user",
  audience: "Users",
  expiresIn: (expiration_day).toString() + 'd',
  algorithm: "RS256"
};

const getSignedToken = (payload) =>
  new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      JWT_PRIVATE_KEY,
      signOptions,
      (err, token) => (err ? reject(err) : resolve(token))
    );
  });

const increaseExpiration = (payload) =>
  new Promise((resolve, reject) => {

    expiration_day = expiration_day + 1
    signOptions.expiresIn = (expiration_day).toString() + 'd'

    jwt.sign(
      payload,
      JWT_PRIVATE_KEY,
      signOptions,
      (err, token) => (err ? reject(err) : resolve(token))
    );
  });

const verifyToken = (req, res, next) => {
  // console.log(req.headers);
  console.log("Request Came at ", new Date(), " For -");
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    //Split at the space
    const bearer = bearerHeader.split(" ");
    //console.log(bearer);
    //Get token from array
    const bearerToken = bearer[1];
    var publicKEY = fs.readFileSync("./public.key", "utf8");
    //console.log(bearerToken);
    jwt.verify(bearerToken, publicKEY, signOptions, (err, authData) => {
      if (err) {
        console.log(err);
        res.send({
          code: 403,
          err_cd: "Invalid Token"
        });
      } else {
        if (authData) {
          //console.log(authData);
          req.token = bearerToken;
          req["token"] = bearerToken;
          //set userData
          req.user_data = authData;
          req["user_data"] = authData;
          next();
        }
      }
    });
  } else {
    //Forbidden
    res.sendStatus(403);
  }
}

module.exports = {
  verifyToken,
  getSignedToken,
  increaseExpiration
};

