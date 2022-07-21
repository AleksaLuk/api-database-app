//Routes for teachers

const express = require("express"); //Importing library for hosting application on the server
const mysqlconnection = require("../services/database"); //Importing database connection
const userMiddleware = require('../middleware/auth.js'); //Import the authorisation and authentication constraints
const procs = require('../queries/storedprocedures') //Importing queries for logging in
let teacherRouter = express.Router(); //Creating an object to hold the teacher routes

//Functional requirement - Teachers can set a mark, which then defines PASS or FAIL Grade_Status
teacherRouter.post("/mark", [userMiddleware.isLoggedIn, userMiddleware.isTeacher], (req, res) => { // login authentication and authorisation - are they a teacher?
    if (!(req.body.Mark>=0 && req.body.Mark<=100)) { //Mark must be between 0 and 100%
        res.status(400).send("Table not updated - Mark must be between 0 and 100.") 
    }
    else {    
        mysqlconnection.query(procs.query5, [req.body.Mark, req.body.UserID, req.body.CourseID], function (error, results, field) { //execute the stored procedure
            console.log(results)
            if (error) {
                res.status(500).send("Table not updated.")
            }
            else if (results.affectedRows == 0) {
                res.status(400).send("Student possibly not enrolled") //return if a row does not exist 
            } 
            else {
                res.send({
                    "msg": "Mark added successfully", //return if row exists 
                    "result": results
                });
            }
        })
    }
});



module.exports = teacherRouter; //exporting the teacher routes 