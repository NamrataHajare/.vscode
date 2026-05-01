const jwt = require('jsonwebtoken');

exports.auth = (req, res,next) => {
    const authHeader = req.headers.authorization;
    console.log('auht');
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded; 
        next();

    } catch (err) {
        return res.status(401).json({ 
            message: 'Invalid or expired token',
            error: err.name 
        });
    }
};
