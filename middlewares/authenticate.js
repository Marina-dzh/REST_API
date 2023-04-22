const { httpError } = require("../helpers");

const { User } = require("../models/user");

const jwt = require("jsonwebtoken");
// const { request } = require("../app");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  console.log("start authenticating");
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(httpError(401));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user|| !user.token || user.token!==token) {
      next(httpError(401));
    }
    req.user=user;
    next();
  } catch {
    next(httpError(401));
  }
};
module.exports = authenticate;





// const {httpError} = require("../helpers")

// const {User} = require("../models/user");

// const jwt = require("jsonwebtoken");

// const {SECRET_KEY}= process.env;

// const authenticate = async (req, res, next) => {
// console.log("start authenticating")
// const {authorization = ""} = req.headers;
// const [bearer, token] = authorization.split(' ');

// if(bearer !== "Bearer") {
//     next(httpError(401, "Bearer"))
// }
// try {
//     const {id} =jwt.verify(token, SECRET_KEY);
//     const user = await User.findById(id);
//     if(!user) {
//         next(httpError(401, "Not Found"));
//     }
//     next();
// } 
// catch {
//     next(httpError(401, "Authentication"));
// }
// };

// module.exports = authenticate;