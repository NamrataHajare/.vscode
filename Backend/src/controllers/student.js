require('dotenv').config();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

exports.getProfile = async (req, res) => {

  const name = req.params.name;

  try {

    const query1 = 'SELECT id, name, dept_name, tot_cred FROM student WHERE name = $1';
    const result = await pool.query(query1, [name]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const query2 = 'SELECT gmail FROM "USER" WHERE name=$1';
    const gmail = await pool.query(query2, [name]);
    const responseData = {
      ...result.rows[0],
      gmail: gmail.rows[0].gmail
    };
    res.status(200).json(responseData);
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
exports.getAllCourses = async (req, res) => {
  console.log('course');
  try {
    const query = 'SELECT * FROM course';
    const result = await pool.query(query);

    res.status(200).json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  const name = req.params.name;

  try {

    const studentQuery = 'SELECT id FROM student WHERE name = $1';
    const studentResult = await pool.query(studentQuery, [name]);

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentId = studentResult.rows[0].id;

    const query = `
      SELECT c.course_id, c.title, c.credits, e.grade
      FROM enrollment e
      JOIN course c ON e.course_id = c.course_id
      WHERE e.student_id = $1
    `;

    const result = await pool.query(query, [studentId]);

    res.status(200).json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error fetching enrolled courses' });
  }
};
exports.enrollCourse = async (req, res) => {

  const { student_name, course_id } = req.body;
  console.log('enroll');
  try {

    const studentQuery = 'SELECT id FROM student WHERE name = $1';
    const studentResult = await pool.query(studentQuery, [student_name]);

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentId = studentResult.rows[0].id;

    const insertQuery = `
      INSERT INTO enrollment (student_id, course_id, semester, year)
      VALUES ($1, $2, 'Sem1', 2025)
    `;

    await pool.query(insertQuery, [studentId, course_id]);

    res.status(201).json({ message: 'Enrollment successful' });

  } catch (err) {

    if (err.code === '23505') {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    console.log(err);
    res.status(500).json({ message: 'Enrollment failed' });
  }
};
exports.getTimetable = async (req, res) => {
  const { name } = req.params;
  console.log('tt');
  const result = await pool.query(
    'SELECT id FROM student WHERE name=$1',
    [name]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const id = result.rows[0].id;

  const timetable = await pool.query(
    `
  SELECT c.title, t.day, t.start_time, t.end_time
  FROM enrollment e
  JOIN course c ON e.course_id = c.course_id
  JOIN section s ON c.course_id = s.course_id
  JOIN time_slot t ON s.time_slot_id = t.time_slot_id
  WHERE e.student_id = $1
  `,
    [id]
  );

  res.json(timetable.rows);

};

exports.getList = async (req, res) => {

  const dept = req.params.name;

  try {
    const list = await pool.query(
      'SELECT * FROM student WHERE dept_name = $1',
      [dept]
    );

    res.status(200).json(list.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error loading data: ' + err });
  }
};
exports.getResult = async (req, res) => {
  try {
    const dept = req.params.name;
    const query = `
      SELECT 
COALESCE(
  COUNT(*) FILTER (WHERE t.grade IS NOT NULL) * 100.0 /
  NULLIF(COUNT(*), 0),
0
) AS pass_percentage
FROM takes t
JOIN student s ON t.student_id = s.id
WHERE LOWER(s.dept_name) = LOWER($1)

    `;

    const result = await pool.query(query, [dept]);
    console.log(parseFloat(result.rows[0].pass_percentage).toFixed(2));
    res.status(200).json({
      pass_percentage: parseFloat(result.rows[0].pass_percentage).toFixed(2)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading result" });
  }
};
