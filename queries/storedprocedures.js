// stored procedures for implementing functional requirements

query1 = "CALL query_1(?, ?)" //Admins should be able to enable or disable the availability of one or more courses
query2 = "CALL query_2(?, ?)" //Admins should be able to assign one or more courses to a teacher
query3 = "CALL query_3()"   //Students can browse and list all the available courses and see the course title and course teacher’s name
query4 = "CALL query_4(?, ?)" //Students can enrol in a course. Students should not be able to enrol in a course more than once at each time
query5 = "CALL query_5(?, ?, ?)" //Teachers can fail or pass a student
query6 = "CALL query_6(?, ?, ?)" //Admins can add new users

module.exports = {
    query1: query1,
    query2: query2,
    query3: query3,
    query4: query4,
    query5: query5,
    query6: query6,
}

