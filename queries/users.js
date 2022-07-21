//Checks related to users to further expand on functional requirements

let admin = "SELECT * FROM USERS WHERE RoleID = 2 AND UserID = ?" //preliminary check to ensure the assigned user is a teacher

let admin2 = "SELECT * FROM users WHERE Name = ?  AND RoleID = ? AND DoB = ?" //check to see if user already exists

let student = "SELECT * FROM courses WHERE CourseID = ? AND isAvailable = 1" //checking if the course selected is available

let student2 = "SELECT * FROM enrolments WHERE UserID = ? AND CourseID = ?" //check to see if user already enroled on the course

module.exports = {
    admin: admin,
    admin2: admin2,
    student: student,
    student2: student2
    
}
