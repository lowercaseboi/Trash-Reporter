// Admin/AdminBackend/authMiddleware.js

const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token received:', token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded; // Attach decoded admin information to request
        next();
    } catch (error) {
        console.error('Invalid or expired token');
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticateAdmin;
