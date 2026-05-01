const express = require('express');
const router = express.Router();
const register = require('../controllers/register');
const {auth} = require('../middleware/auth');
const student = require('../controllers/student');
const faculty = require('../controllers/faculty');
const adminController = require('../controllers/admin');

router.post('/add-course', auth,adminController.addCourse);
// router.get('/departments', auth,adminController.getDepartments);
router.get('/faculty/:dept_name',auth, adminController.getFacultyByDept);
router.get('/sections-by-course/:course_id', auth,adminController.getSectionsByCourse);
router.get('/courses/:dept_name', auth,adminController.getCoursesByDept);

router.get('/sections/:dept_name', auth,adminController.getSectionsByDept);

router.post('/assign-faculty', auth,adminController.assignFaculty);
router.post('/assign-faculty',auth, adminController.assignFaculty);
router.get('/all-data',auth, adminController.getAllData);
router.post('/login', register.login);
router.post('/signup',register.signup);
router.get('/student/:name',auth,student.getProfile);
router.get('/course',auth,student.getAllCourses);
router.get('/enrollment/:name',auth,student.getEnrolledCourses);
router.post('/enrollment',auth,student.enrollCourse);
router.get('/timetable/:name',auth,student.getTimetable);
router.get('/studentlist/:name',auth,student.getList);
router.get('/faculty/:name',auth,faculty.getProfile);
router.get('/schedule/:name',auth,faculty.getSchedule);
router.get('/courses/:name',auth,faculty.getCourses);
router.post('/assign-grade',auth,faculty.assignGrade);
router.get('/facultylist/:name',auth,faculty.getList);
router.get('/result/:name',auth,student.getResult);

module.exports = router;