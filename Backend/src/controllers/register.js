require('dotenv').config();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { gmail, password } = req.body;

    if (!gmail || !password) {
        return res.status(400).json({ message: 'All fields are mandatory' });
    }

    try {
        const exist = await pool.query(
            'SELECT * FROM "USER" WHERE Gmail = $1 AND Password = $2',
            [gmail, password]
        );

        if (exist.rows.length === 0) {
            return res.status(401).json({ message: 'User does not exist' });
        }
        const user = exist.rows[0];
        let deptName = null;

        if (user.role === 'student') {
            const deptResult = await pool.query(
                'SELECT dept_name FROM student WHERE name = $1',
                [user.name]
            );

            if (deptResult.rows.length > 0) {
                deptName = deptResult.rows[0].dept_name;
            }
        }
        else if(user.role==='faculty'){
                const deptResult = await pool.query(
                'SELECT dept_name FROM faculty WHERE name = $1',
                [user.name]
            );

            if (deptResult.rows.length > 0) {
                deptName = deptResult.rows[0].dept_name;
            }
        }
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            role: user.role,
            token: token,
            name: user.name,
            dept: deptName
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err });
    }
 };
// exports.signup = async (req, res) => {
//     const { name, gmail, password, department, role } = req.body;

//     console.log('enter');

//     if (!name || !gmail || !password || !department || !role) {
//         return res.status(400).json({ message: 'All fields are mandatory' });
//     }

//     try {
//         const result = await pool.query(
//             'SELECT * FROM "USER" WHERE Gmail = $1',
//             [gmail]
//         );

//         if (result.rows.length > 0) {
//             return res.status(409).json({ message: 'User already exists' });
//         }
//         const dept = await pool.query(
//             'SELECT * FROM department WHERE dept_name = $1', [department]
//         );

//         if (dept.rows.length == 0) {
//             res.status(500).json({ message: 'department does not exist' });
//         }
//         await pool.query(
//             'INSERT INTO "USER" (name, Gmail, Password, role) VALUES ($1, $2, $3, $4)',
//             [name, gmail, password, role]
//         );

//         if (role == 'student') {
//             await pool.query(
//                 'INSERT INTO student(name,dept_name)  VALUES ($1,$2)', [name, department]
//             );
//         }
//         else if (role == 'faculty') {
//             await pool.query(
//                 'INSERT INTO faculty(name,dept_name,email)  VALUES ($1,$2,$3)', [name, department, gmail]
//             );
//         }

//         res.status(201).json({ message: 'Signup successful' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: err.message });
//     }
// };
exports.signup = async (req, res) => {
    const { name, gmail, password, department } = req.body;

    if (!name || !gmail || !password || !department) {
        return res.status(400).json({ message: 'All fields are mandatory' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM "USER" WHERE Gmail = $1',
            [gmail]
        );
        if (result.rows.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const dept = await pool.query(
            'SELECT * FROM department WHERE dept_name = $1',
            [department]
        );
        if (dept.rows.length === 0) {
            return res.status(400).json({ message: 'Department does not exist' });
        }

        let role = 'student'; // default
        if (gmail.endsWith('@faculty.college.edu')) {
            role = 'faculty';
        }

        // Insert into USER table
        await pool.query(
            'INSERT INTO "USER" (name, Gmail, Password, role) VALUES ($1, $2, $3, $4)',
            [name, gmail, password, role]
        );

        // Insert into specific table
        if (role === 'student') {
            await pool.query(
                'INSERT INTO student(name, dept_name) VALUES ($1, $2)',
                [name, department]
            );
        } else if (role === 'faculty') {
            await pool.query(
                'INSERT INTO faculty(name, dept_name, email) VALUES ($1, $2, $3)',
                [name, department, gmail]
            );
        }

        res.status(201).json({ message: 'Signup successful', role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};