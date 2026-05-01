const pool = require('../config/db'); // your postgres pool

// Add Course
exports.addCourse = async (req, res) => {
  try {
    const { course_id, title, dept_name, credits } = req.body;

    await pool.query(
      'INSERT INTO course (course_id, title, dept_name, credits) VALUES ($1, $2, $3, $4)',
      [course_id, title, dept_name, credits]
    );

    res.status(200).json({ message: 'Course added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding course', error: err.message });
  }
};

exports.getFacultyByDept = async (req, res) => {
  try {
    const { dept_name } = req.params;

    const result = await pool.query(
      `SELECT id, name 
       FROM faculty 
       WHERE dept_name = $1`,
      [dept_name]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getCoursesByDept = async (req, res) => {
  try {
    const { dept_name } = req.params;

    const result = await pool.query(
      `SELECT course_id, title 
       FROM course 
       WHERE dept_name = $1`,
      [dept_name]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getSectionsByDept = async (req, res) => {
  try {
    const { dept_name } = req.params;

    const result = await pool.query(
      `SELECT s.section_id, s.sec_id, s.course_id
       FROM section s
       JOIN course c ON s.course_id = c.course_id
       WHERE c.dept_name = $1`,
      [dept_name]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.assignFaculty = async (req, res) => {
  try {
    const { faculty_id, course_id, section_id, semester, year } = req.body;

    const sectionCheck = await pool.query(
      `SELECT * FROM section 
       WHERE section_id = $1 AND course_id = $2`,
      [section_id, course_id]
    );

    if (sectionCheck.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid section for selected course"
      });
    }

    if (!sectionCheck.rows[0].time_slot_id) {
      return res.status(400).json({
        message: "Please assign time slot to section first"
      });
    }

    // 3️⃣ Insert into teaches
    await pool.query(
      `INSERT INTO teaches (id, course_id, section_id, semester, year)
       VALUES ($1, $2, $3, $4, $5)`,
      [faculty_id, course_id, section_id, semester, year]
    );

    res.json({ message: "Faculty assigned successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
exports.getSectionsByCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const result = await pool.query(
      `SELECT section_id, sec_id, course_id, time_slot_id, building, room_number
       FROM section
       WHERE course_id = $1`,
      [course_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
// exports.assignFaculty = async (req, res) => {
//   try {
//     const { faculty_id, course_id, section_id, semester, year, dept_name } = req.body;

   
//     const facultyCheck = await pool.query(
//       `SELECT * FROM faculty 
//        WHERE id = $1 AND dept_name = $2`,
//       [faculty_id, dept_name]
//     );

//     if (facultyCheck.rows.length === 0) {
//       return res.status(400).json({
//         message: "Faculty does not belong to selected department"
//       });
//     }

//     // Insert
//     await pool.query(
//       `INSERT INTO teaches (id, course_id, section_id, semester, year)
//        VALUES ($1, $2, $3, $4, $5)`,
//       [faculty_id, course_id, section_id, semester, year]
//     );

//     res.json({ message: "Faculty assigned successfully" });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }

//  };
// exports.assignFaculty = async (req, res) => {
//   try {
//     const { faculty_id, course_id, section_id, semester, year } = req.body;

//     await pool.query(
//       'INSERT INTO teaches (id, course_id, sec_id, semester, year) VALUES ($1, $2, $3, $4, $5)',
//       [faculty_id, course_id, section_id, semester, year]
//     );

//     res.status(200).json({ message: 'Faculty assigned successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error assigning faculty', error: err.message });
//   }
// };
exports.getAllData = async (req, res) => {
  try {

    const studentsRes = await pool.query(`
      SELECT dept_name,
             json_agg(json_build_object(
               'id', id,
               'name', name,
               'tot_cred', tot_cred
             )) AS students
      FROM student
      GROUP BY dept_name
      ORDER BY dept_name
    `);

    const facultyRes = await pool.query(`
      SELECT dept_name,
             json_agg(json_build_object(
               'id', id,
               'name', name,
               'salary', salary
             )) AS faculty
      FROM faculty
      GROUP BY dept_name
      ORDER BY dept_name
    `);

    const coursesRes = await pool.query(`
      SELECT dept_name,
             json_agg(json_build_object(
               'course_id', course_id,
               'title', title
             )) AS courses
      FROM course
      GROUP BY dept_name
      ORDER BY dept_name
    `);

    res.status(200).json({
      students: studentsRes.rows,
      faculty: facultyRes.rows,
      courses: coursesRes.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error loading lists', error: err.message });
  }
};