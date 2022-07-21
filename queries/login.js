//Queries for checking role and password procedures

//set new password in the users table
let setpassword = `UPDATE users  
SET Password = ?
WHERE userID = ?;`

//get password for comparison against user input
let comparepassword = `SELECT Password
FROM users
WHERE UserID = ?;`

//get role of the user
let checkrole = `SELECT RoleID
FROM users
WHERE UserID = ?`

module.exports = {
    setpassword: setpassword,
    comparepassword: comparepassword,
    checkrole: checkrole
}

