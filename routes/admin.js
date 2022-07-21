//Adminn routes (end points)

const express = require("express"); //library for hosting application on the server
const mysqlconnection = require("../services/database"); //Importing database/mysql connection
const userMiddleware = require('../middleware/auth.js'); //Import the authorisation and authentication constraints
const queries = require('../queries/users') //Importing queries for logging in
const procs = require('../queries/storedprocedures')
let adminRouter = express.Router(); //Creating an object to hold the admin routes

//Functional requirement - Admins should be able to enable or disable the availability of a course 
adminRouter.post("/setavailability", [userMiddleware.isLoggedIn, userMiddleware.isAdmin], (req, res) => { // login authentication and authorisation - are they an admin?
    if (!(req.body.isAvailable==0 || req.body.isAvailable==1)) { //Availability must be 1 or 0 
        res.status(400).send("Table not updated - Is available must be 1 or 0.") 
    }
    else { 
        mysqlconnection.query(procs.query1, [req.body.CourseID.join(","), req.body.isAvailable], function (error, results, fields) { //executing query to update availability
            if (error) { 
                res.status(500).send("Table Not Updated.");
            }
            else if (results.affectedRows == 0) { 
                res.status(400).send("Table Not Updated. 0 Rows affected. Input or query problem.");
            } 
            else {
                res.status(200).send({
                    "msg": "Table Updated Successfully",
                    "result": results
                });
            }
        })
    }  
})

//Functional requirement - Admins should be able to assign one or more courses to a teacher 
adminRouter.post("/assignteacher", [userMiddleware.isLoggedIn, userMiddleware.isAdmin], (req, res) => { // login authentication and authorisation - are they an admin?
    mysqlconnection.query(queries.admin, [req.body.TeacherID], //preliminary check to ensure the assigned user is a teacher
    function (error, results2, fields) {
        if (!results2.length || results2.affectedRows == 0) {
            res.status(403).send("Table not updated - user must be a teacher.")
        }
        else {
            mysqlconnection.query(procs.query2, [req.body.TeacherID, req.body.CourseID.join(",")], function (error, results, fields) {
                if (error) { 
                    res.status(500).send("Table Not Updated. Internal error.");
                }
                else if (results.affectedRows == 0) { 
                    res.status(400).send("Table Not Updated. 0 Rows affected. Input or query problem.");
                } else {
                    res.status(200).send({
                        "msg": "Table Updated Successfully",
                        "result": results
                    });
                }
            })
        }
    })
});

//Functional requirement - Admins should be able to add new users
adminRouter.post("/createuser", [userMiddleware.isLoggedIn, userMiddleware.isAdmin], (req, res) => { // login authentication and authorisation - are they an admin/are they logged in
    mysqlconnection.query(queries.admin2, [req.body.Name, req.body.RoleID, req.body.DoB], //preliminary check if user already exists
    function (error, results2, fields) {
        if (results2.length) {
            res.status(403).send("Table not updated - user already exists.")
        }
        else {
            mysqlconnection.query(procs.query6, [req.body.Name, req.body.RoleID, req.body.DoB], function (error, results, fields) {
                if (error) { 
                    res.status(500).send("Table Not Updated. Internal error.");
                }
                else if (results.affectedRows == 0) { 
                    res.status(400).send("Table Not Updated. 0 Rows affected. Input or query problem.");
                } else {
                    res.status(200).send({
                        "msg": "Table Updated Successfully",
                        "result": results
                    });
                }
            })
        }
    })
});






module.exports = adminRouter; //exporting the admin routes 