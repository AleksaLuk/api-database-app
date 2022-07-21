//The application entry file

const express = require('express'); //library for hosting application on the server
const bodyParser = require('body-parser'); //library for parsing the body of requests
const app = express(); //creating an express base app
const PORT = 5050; //setting the port that the app will be hosted on

app.use(express.json()) //the app must recognize the incoming Request Object as a JSON Object
app.use(bodyParser.json()); //parse the body as json
require("./startup/routes")(app); //importing routes from startup/routes.js

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`)); //running the server

module.exports = app //exporting the application
