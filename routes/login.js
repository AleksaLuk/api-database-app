//Routes for logging in and setting password

const mysqlconnection = require("../services/database"); //Importing database connection
const queries = require('../queries/login') //Importing queries for logging in
const jwt = require('jsonwebtoken'); //Importing a preinstalled library to generate user tokens
const bcrypt = require('bcrypt'); //Importing a preinstalled library for hashing passwords
const userMiddleware = require('../middleware/auth.js'); //Import the authorisation and authentication constraints
const express = require("express"); //Importing library for hosting application on the server


let findUserRouter = express.Router(); //Creating an object to hold the login routes 


findUserRouter.post('/setpassword', [userMiddleware.validatePassword], (req, res) => {
  const salt = bcrypt.genSaltSync(10);   // Generate Salt
  const hash_password = bcrypt.hashSync(req.body.Password, salt);  // Hash Password

  //Setting the password for any user using the hash encryption
  mysqlconnection.query(queries.setpassword, [hash_password, req.body.UserID], function (err, result, fields) {
    console.log(result);
    if (!("UserID" in req.body) | !("Password" in req.body)) {
        res.status(400).send(
            {
                msg: "Bad request. Incorrect input format",
                fmt: {"UserID": "", "Password": ""}
            }
        )
    }
    else if (result.affectedRows == 0) {
      res.status(404).send("User not found.") //not possible to set password for userID that does not exist
    }
    else {
        if (err) {
            res.status(400)
            res.send("Password not created")
            throw err;
        }
        else {
            res.status(200)
            res.send("Password updated successfully.") 
        }
    }
  });
});

//User login with raw password and userID
findUserRouter.post('/login', (req, res) => {

  mysqlconnection.query(queries.comparepassword, [req.body.UserID], function (err, result, fields) {
      if (err) {
        throw err;
      }
      else if (result[0] === undefined) {
        res.status(404).send("Password has not been set or UserID does not exist")
      }
      else {
        hashpass = result[0].Password; // stored hash password
        if (bcrypt.compareSync(req.body.Password, hashpass)) { //compare function to compare supplied and stored password
          data = {
            UserID: req.body.UserID 
          }
          const token = jwt.sign(data, //token generating library and it takes userID as input
          'SECRETKEY', //token generatinng library takesn in SECRETKEY to make token generation unique for that key
          {expiresIn: '10m'} //token expiration time
          )
          return res.status(200).send({
            msg: 'Logged in!',
            token //supply token for users to authenticate/authorise their actions
          });
          
        }
          else {
            res.status(400)
            res.send("Incorrect username or password") 
          }
        }
    }) 
  })

module.exports = findUserRouter; //exporting the login routes 
