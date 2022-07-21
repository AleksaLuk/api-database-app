//Middleware - provide authentication (login) and authorisation (action permissions) for the application.


const queries = require("../queries/login"); //Importing queries for logging in
const mysqlconnection = require("../services/database"); //Importing database connection
const jwt = require("jsonwebtoken"); //Importing a preinstalled library to generate user tokens


module.exports = { //Define which variables are available for importing from other files

  validatePassword: (req, res, next) => {
  // password min 6 chars
  if (!req.body.Password || req.body.Password.length < 6) {
    return res.status(400).send({
      msg: 'Please enter a password with minimum 6 characters'
    });
  }
  next();
  },

  isLoggedIn: (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]; //Accessing the token from request header
    jwt.verify(token, "SECRETKEY", (err, decoded) => { //validate the token
        if (err) {
          return res.status(401).send({
            message: "Unauthorized!"
          });
        }
        req.UserID = decoded.UserID; //decode the token to get the userID and set it in the request object so that it can be accessed by below user constraints
        next();
    })
  },

  //check if user is an Admin 
  isAdmin: (req, res, next) => {
    mysqlconnection.query(queries.checkrole, [req.UserID], function (err, result, fields) { 
      if (err) {
          throw err;
        }
      var role = result[0].RoleID;
      if (role == 1){
          next();
      }
      else {
          res.status(403).send({
              message: "Requires Admin Role"
          });
      }
    })
  },

  //check if user is a Teacher
  isTeacher: (req, res, next) => {
    mysqlconnection.query(queries.checkrole, [req.UserID], function (err, result, fields) {
      if (err) {
          throw err;
        }
      var role = result[0].RoleID;
      if (role == 2){
          next();
      }
      else {
          res.status(403).send({
              message: "Requires Teacher Role"
            });
      }
    })
  },

  //Check if user is a Student
  isStudent: (req, res, next) => {
    mysqlconnection.query(queries.checkrole, [req.UserID], function (err, result, fields) {
      if (err) {
          throw err;
        }
      var role = result[0].RoleID;
      if (role == 3){
          next();
      }
      else {
          res.status(403).send({
              message: "Requires Student Role"
            });
      }
    })
  },
};

