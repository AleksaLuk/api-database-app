//Setting up the database connection

const mysql = require('mysql2'); //Import mysql2 library
const mysqlconnection = mysql.createConnection({ //create connection
    host: "localhost", 
    user: "root",
    password: "",
    database: "mydb"
});

mysqlconnection.connect((err) => { //making connection
    if (!err) {
        console.log("Connection OK");
    }
    else {
        console.log("Connection Fail");
        throw err;
    }
})


module.exports = mysqlconnection; //exporting the connection