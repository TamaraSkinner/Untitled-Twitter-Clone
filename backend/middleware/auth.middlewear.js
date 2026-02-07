const jwt = require('jsonwebtoken');

function authenticateWiz(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'No magic token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.wizard = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid magic token' });
    }
}

module.exports = authenticateWiz;