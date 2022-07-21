//Organising route categories

//Imports 
const express = require("express"); //library for hosting application on the server
var admin = require("../routes/admin"); //Importing route file for admins (set availability and set teacher)
var teacher = require("../routes/teacher"); //Importing route file for teacher (set mark)
var student = require("../routes/student"); //Importing route file for student (enrolment/availability)
var login = require("../routes/login"); //Importing route file for logins (set password/login)

//Integrating imports into the app
module.exports = function (app) {
    app.use(express.json());
    app.use("/login", login)
    app.use("/admin", admin);
    app.use("/teacher", teacher);
    app.use("/student", student);
};
