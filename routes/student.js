//Routes for students

const express = require("express"); //Importing library for hosting application on the server
const mysqlconnection = require("../services/database"); //Importing database connection
const userMiddleware = require('../middleware/auth.js'); //Import the authorisation and authentication constraints
const queries = require('../queries/users')
const procs = require('../queries/storedprocedures')
let studentRouter = express.Router(); //Creating an object to hold the students routes

//Functional requirement - Students can browse and list all the available courses and see the course title and course teacher’s name
studentRouter.get("/availability", [userMiddleware.isLoggedIn, userMiddleware.isStudent], (req, res) => {
    mysqlconnection.query(procs.query3, function (error, results, fields) {
        if (error) {
            res.status(500).send("Internal Error.");
        } else {
            res.status(200).send(results[0]);
            console.log(results)
        }
    });
})

//Functional requirement - Students can enrol in a course. Students should not be able to enrol in a course more than once at each time
studentRouter.post("/enrolment", [userMiddleware.isLoggedIn, userMiddleware.isStudent], (req, res) => { // login authentication and authorisation - are they a student?
    mysqlconnection.query(queries.student, [req.body.CourseID], //checking if the course selected is available
    function (error, result, field) {
        if (!result.length) {
            res.status(400).send("Course is not available.")
         }
        else {          
            mysqlconnection.query(queries.student2, [req.UserID, req.body.CourseID], //check to see if user already enroled on the course
            function (error, result, field) {
                if (result.length) { //check if there is data within the result variable i.e is there a row existing from the above query
                    res.status(403).send("Student is already enrolled on this course.") //return if result exists 
                }
                else {
                    mysqlconnection.query(procs.query4, [req.body.CourseID, req.UserID], function (error, results, field) { //if no result exists call the stored procedure
                        if (error) {
                            res.status(400).send("Table not updated.")
                        } else {
                            res.status(200).send({
                                "msg": "Enrolment successful",
                                "result": results
                            })
                        }
                    })
                }
            })
        }
    })
});

module.exports = studentRouter; //exporting the student routes 