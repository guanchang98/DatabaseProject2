# DatabaseProject2
# CS5200 Project2

# DrivingSchoolSchedulingSystem
An Application Using Node + Express + SQlite + EJS implementing a Driving School Scheduling System for both students and managers.

1. Requirements

Design a scheduling application for a driving school. 


2. Conceptual Model *png

![alt text](https://github.com/Dabaiee/CS5200/blob/main/2.Conceptual%20Model%20of%20Driving%20School%20Scheduling%20System%20(2).png?raw=true)

	./SQL_backup
	
3. Logical Model *png

![alt text](https://github.com/guanchang98/DatabaseProject1/blob/main/3.Logical%20model%20of%20Driving%20School%20Scheduling%20System.png?raw=true)

	./SQL_backup
	
4. database *db *sql

	./SQL_backup
5. query *sql

	./SQL_backup
	
6. What is the project? & What was the original proposal?

The project is to implement a web application for a driving school scheduling system allowing both managers and students to use it. The original proposal was that managers can create, read, update, and edit the courses' information from the manager page. Besides, students can create an account, register for courses, and find information about them.

7. Team member contribution


Individual Contributions

Chang Guan implements: 
	UML class diagram
	Designing the page of managers, allowing managers to CRUD courses.
	CRUD operations on the courses' information
	CRUD appointments and implement adding students to a certain course.
	Query/ filter functions. Such as searching courses by name, sorting by start time.
	Implement the web application of manager's page, DB, and testing. Creating the database, and importing test data.
  Debugging and making codes work well.

Tong Zhou implements:
	ERD and relational schema
	Designing the page of students, and students can create a new account, has a overview of courses and register in.
	CRUD operations on the students' information
	CRUD operations on the coaches' information
	Showing information of courses for students, including coaches' information and courses' information. 
	Implement the web application's student page, front-end, and back-end, redirections, debugging.
	




## Using it

1) Clone the repo
2) Install the dependencies

```
npm install
```


3) Start the server

```
npm start
```

4) Point your browser to http://locahost:3000
5) If there is an error about Sqlite3, remember to install sqlite3.

```
npm install sqlite3
npm install sqlite
```

