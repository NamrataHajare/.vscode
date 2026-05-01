require('dotenv').config();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

exports.getProfile = async (req, res) => {

    const name = req.params.name;

    try {

        const query1 = 'SELECT id, name, dept_name, email ,salary FROM faculty WHERE name = $1';
        const result = await pool.query(query1, [name]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'faculty not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: 'Invalid token' });
    }
};
exports.getSchedule = async (req, res) => {
    try {
        const { name } = req.params;

        const result = await pool.query(
            'SELECT id FROM faculty WHERE name=$1',
            [name]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'faculty not found' });
        }

        const facultyId = result.rows[0].id;
 const timetable = await pool.query(
`SELECT c.title AS course_title,
        s.section_id,
        t.day,
        t.start_time,
        t.end_time,
        s.building,
        s.room_number
 FROM teaches e
 JOIN section s ON e.section_id = s.section_id
 JOIN course c ON s.course_id = c.course_id
 JOIN time_slot t ON s.time_slot_id = t.time_slot_id
 WHERE e.id = $1
 ORDER BY t.day, t.start_time`,
[facultyId]
);

        res.json(timetable.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// exports.getCourses = async (req, res) => {
//     try {
//         const facultyName = req.params.name;

//         const facultyResult = await pool.query(
//             'SELECT id FROM faculty WHERE name = $1',
//             [facultyName]
//         );

//         if (facultyResult.rows.length === 0) {
//             return res.status(404).json({ message: "Faculty not found" });
//         }

//         const facultyId = facultyResult.rows[0].id;

//         const coursesQuery = `SELECT c.course_id,
//             c.title,s.section_id,t.day,t.start_time,t.end_time,
//             s.room_number,st.id AS student_id,st.name AS student_name,tk.grade
//             FROM teaches e
//             JOIN course c ON e.course_id = c.course_id
//             JOIN section s ON e.section_id = s.section_id
//             JOIN time_slot t ON s.time_slot_id = t.time_slot_id
//             LEFT JOIN takes tk ON s.section_id = tk.section_id
//             LEFT JOIN student st ON tk.student_id = st.id WHERE e.id = $1
//             ORDER BY c.course_id, s.section_id, st.id;`

//         const { rows } = await pool.query(coursesQuery, [facultyId]);

//         const courses = [];
//         const courseMap = {};

//         rows.forEach(row => {
//             if (!courseMap[row.course_id]) {
//                 courseMap[row.course_id] = {
//                     course_id: row.course_id,
//                     title: row.title,
//                     sections: []
//                 };
//                 courses.push(courseMap[row.course_id]);
//             }

//             let section = courseMap[row.course_id].sections.find(
//                 s => s.section_id === row.section_id
//             );

//             if (!section) {
//                 section = {
//                     section_id: row.section_id,
//                     time_slot: `${row.day} ${row.start_time}-${row.end_time}`,
//                     classroom: row.room_number,
//                     students: []
//                 };
//                 courseMap[row.course_id].sections.push(section);
//             }

//             if (row.student_id) {
//                 section.students.push({
//                     student_id: row.student_id,
//                     name: row.student_name,
//                     grade: row.grade
//                 });
//             }
//         });

//         res.json(courses);

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Server error fetching courses' });
//     }
// };
exports.getCourses = async (req, res) => {
  try {
    const facultyName = req.params.name.trim();

    // Get faculty ID using name (case-insensitive)
    const facultyResult = await pool.query(
      'SELECT id FROM faculty WHERE name ILIKE $1',
      [facultyName]
    );

    if (facultyResult.rows.length === 0) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    const facultyId = facultyResult.rows[0].id;

    // Get courses assigned to this faculty
    const coursesQuery = `
      SELECT c.course_id, c.title,
             s.section_id, s.semester, s.year,
             s.building, s.room_number, s.time_slot_id
      FROM teaches t
      JOIN course c ON t.course_id = c.course_id
      JOIN section s ON t.section_id = s.section_id
      WHERE t.faculty_id = $1
      ORDER BY c.course_id, s.section_id
    `;

    const { rows } = await pool.query(coursesQuery, [facultyId]);

    res.json(rows);

  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Server error fetching courses' });
  }
};
exports.assignGrade = async (req, res) => {
    const client = await pool.connect();

    try {
        const { student_id, section_id, grade } = req.body;

        await client.query('BEGIN');

        const updateTakes = `
            UPDATE takes
            SET grade = $1
            WHERE student_id = $2 AND section_id = $3
        `;
        await client.query(updateTakes, [grade, student_id, section_id]);

        const updateEnrollment = `
            UPDATE enrollment
            SET grade = $1
            WHERE student_id = $2
              AND course_id = (
                    SELECT course_id
                    FROM section
                    WHERE section_id = $3
              )
        `;
        await client.query(updateEnrollment, [grade, student_id, section_id]);

        await client.query('COMMIT');

        res.json({ message: 'Grade assigned successfully in both tables' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Server error assigning grade' });
    } finally {
        client.release();
    }
};

exports.getList = async (req, res) => {

  const dept = req.params.name;

  try {
    const list = await pool.query(
      'SELECT * FROM Faculty WHERE dept_name = $1',
      [dept]
    );

    res.status(200).json(list.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error loading data: ' + err });
  }
};
