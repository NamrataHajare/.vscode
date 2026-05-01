


CREATE TABLE "USER" (
    id SERIAL PRIMARY KEY,
    Gmail VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "USER" (Gmail, Password, role, name)
VALUES (
    'user@example.com',
    'john',
    'student',
    'John Doe'
);

select * from "USER";

select * from course;
delete from course where course_id = 'AM101';
select * from student;
CREATE TABLE student ( 
ID SERIAL , 
name VARCHAR(100), 
dept_name VARCHAR(50), 
tot_cred INT, PRIMARY KEY (ID), 
FOREIGN KEY (dept_name) REFERENCES department(dept_name)
);
drop table student;
CREATE TABLE department ( 
dept_name VARCHAR(50), 
building VARCHAR(50), 
budget DECIMAL(12,2), 
PRIMARY KEY (dept_name) );
select * from faculty;
INSERT INTO department (dept_name,building,budget)VALUES('cse','2','100000.0');
select * from course;
delete from course where course_id = 'CS109';
CREATE TABLE course (
    course_id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    dept_name VARCHAR(50),
    credits INT CHECK (credits > 0),

    FOREIGN KEY (dept_name)
        REFERENCES department(dept_name)
        ON DELETE SET NULL
);

CREATE TABLE enrollment (
    student_id INT,
    course_id VARCHAR(10),
    semester VARCHAR(20),
    year INT,
    grade VARCHAR(2),

    PRIMARY KEY (student_id, course_id, semester, year),

    FOREIGN KEY (student_id)
        REFERENCES student(id)
        ON DELETE CASCADE,

    FOREIGN KEY (course_id)
        REFERENCES course(course_id)
        ON DELETE CASCADE
);
INSERT INTO department Values ('AIML','3','100000.0');
select * from depa
INSERT INTO course (course_id, title, dept_name, credits) VALUES
('CS101', 'Programming in C', 'cse', 4),
('CS102', 'Data Structures', 'cse', 4),
('CS201', 'Database Management Systems', 'cse', 3),
('CS202', 'Operating Systems', 'cse', 4),
('CS301', 'Computer Networks', 'cse', 3),
('CS302', 'Software Engineering', 'cse', 3),
('CS303', 'Artificial Intelligence', 'AIML', 3),
('CS304', 'Web Technologies', 'cse', 3);


CREATE TABLE time_slot (
    time_slot_id VARCHAR(10) PRIMARY KEY,
    day VARCHAR(10),          
    start_time TIME,
    end_time TIME
);

INSERT INTO time_slot VALUES 
('CS101', 'Monday', '09:00:00', '10:00:00');

CREATE TABLE section (
    section_id SERIAL PRIMARY KEY,
    course_id VARCHAR(10),
    sec_id VARCHAR(5),        
    semester VARCHAR(10),
    year INT,
    building VARCHAR(20),
    room_number VARCHAR(10),
    time_slot_id VARCHAR(10),

    FOREIGN KEY (course_id) REFERENCES course(course_id),
    FOREIGN KEY (time_slot_id) REFERENCES time_slot(time_slot_id)
);

INSERT INTO section
(course_id, sec_id, semester, year, building, room_number, time_slot_id)
VALUES
('CS101', 'A', 'Odd', 2025, 'Block1', '101', 'CS101');


CREATE TABLE faculty (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dept_name VARCHAR(30),
    email VARCHAR(100),
    phone VARCHAR(15),
    salary DECIMAL(10,2),
    CONSTRAINT fk_faculty_department FOREIGN KEY (dept_name) REFERENCES department(dept_name)
);

 select * from faculty

CREATE TABLE advisor (
    advisor_id INT,
    student_id INT,
    PRIMARY KEY (advisor_id, student_id),
    CONSTRAINT fk_advisor_instructor FOREIGN KEY (advisor_id) REFERENCES instructor(instructor_id),
    CONSTRAINT fk_advisor_student FOREIGN KEY (student_id) REFERENCES student(student_id)
);

CREATE TABLE teaches (
    id SERIAL NOT NULL,
    course_id VARCHAR(10) NOT NULL,
    section_id INT NOT NULL,
    semester VARCHAR(10),
    year INT,
    PRIMARY KEY (id, course_id, section_id, semester, year),
    FOREIGN KEY (id) REFERENCES faculty(id),
    FOREIGN KEY (course_id) REFERENCES course(course_id),
    FOREIGN KEY (section_id) REFERENCES section(section_id)
);

INSERT INTO teaches (id, course_id, section_id, semester, year)
VALUES
(1, 'CS101', 1, 'Fall', 2025);

select * from student;

CREATE TABLE takes (
    student_id INT,
    section_id INT,
    grade CHAR(2),
    PRIMARY KEY (student_id, section_id),
    CONSTRAINT fk_takes_student FOREIGN KEY (student_id) REFERENCES student(ID),
    CONSTRAINT fk_takes_section FOREIGN KEY (section_id) REFERENCES section(section_id)
);

SELECT e.id AS teaches_id, e.course_id, e.section_id, f.id AS faculty_id, f.name
FROM teaches e
JOIN faculty f ON e.id = f.id;

select * from section;
drop table teaches;

INSERT INTO takes (student_id, section_id, grade)
VALUES
(1, 1, NULL); 

-- Time slots for different courses and sections
INSERT INTO time_slot (time_slot_id, day, start_time, end_time) VALUES
('TS101', 'Monday',    '09:00:00', '10:00:00'),
('TS102', 'Tuesday',   '10:00:00', '11:00:00'),
('TS103', 'Wednesday', '11:00:00', '12:00:00'),
('TS104', 'Thursday',  '14:00:00', '15:00:00'),
('TS105', 'Friday',    '15:00:00', '16:00:00');
select * from "USER";

INSERT INTO section (course_id, sec_id, semester, year, building, room_number, time_slot_id) VALUES
('CS101', 'A', 'Fall', 2025, 'Block1', '101', 'TS101'),
('CS102', 'B', 'Fall', 2025, 'Block1', '102', 'TS102'),
('CS201', 'A', 'Fall', 2025, 'Block2', '201', 'TS103'),
('CS202', 'B', 'Fall', 2025, 'Block2', '202', 'TS104'),
('CS301', 'A', 'Fall', 2025, 'Block3', '301', 'TS105');

INSERT INTO faculty (name, dept_name, email, phone, salary) VALUES
('Dr. Rahul Patil', 'cse', 'rahul@example.com', '9876543210', 45000.0),
('Dr. Sneha Desai', 'AIML', 'sneha@example.com', '9988776655', 55000.0);


INSERT INTO student (name, dept_name) VALUES
('Alice Patil', 'cse'),
('Bob Shinde',  'cse');


INSERT INTO faculty (name, dept_name, email) VALUES
('Dr. Namrata Hajare', 'cse', 'namrata@faculty.college.edu'),
('Prof. Rajesh Kale',  'cse', 'rajesh@faculty.college.edu');

INSERT INTO department (dept_name) VALUES
('ece');

INSERT INTO faculty (id, name, dept_name, email, salary) VALUES
(20, 'Dr. Meera Joshi', 'ece', 'meera@faculty.college.edu', 54000),
(21, 'Dr. Rahul Patil', 'ece', 'rahul@faculty.college.edu', 51000);

INSERT INTO course (course_id, title, dept_name, credits) VALUES
('EC301', 'Digital Electronics', 'ece', 4),
('EC302', 'Microprocessors', 'ece', 3),
('EC303', 'Signals and Systems', 'ece', 4);

INSERT INTO time_slot (time_slot_id, day, start_time, end_time) VALUES
('TS301', 'Monday', '08:00:00', '09:00:00'),
('TS302', 'Tuesday', '09:00:00', '10:00:00'),
('TS303', 'Wednesday', '10:00:00', '11:00:00');

INSERT INTO section (section_id, course_id, sec_id, semester, year, building, room_number, time_slot_id) VALUES
(20, 'EC301', 'A', 'Spring', 2026, 'Block5', '501', 'TS301'),
(21, 'EC302', 'B', 'Spring', 2026, 'Block5', '502', 'TS302'),
(22, 'EC303', 'A', 'Spring', 2026, 'Block6', '601', 'TS303');

INSERT INTO teaches (id, course_id, section_id, semester, year) VALUES
(20, 'EC301', 20, 'Spring', 2026),
(20, 'EC302', 21, 'Spring', 2026),
(21, 'EC303', 22, 'Spring', 2026);

INSERT INTO student (id, name, dept_name, tot_cred) VALUES
(20, 'Anjali Deshmukh', 'ece', 10),
(21, 'Kiran More', 'ece', 12),
(22, 'Siddharth Patil', 'ece', 8);

INSERT INTO takes (student_id, section_id, grade) VALUES
(20, 20, 'A'),
(21, 20, 'B'),
(22, 21, 'A'),
(20, 21, 'B'),
(21, 22, 'A');