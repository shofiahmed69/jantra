const jwt = require('jsonwebtoken');
const env = require('../config/env');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('[Auth] Header:', authHeader ? 'present' : 'MISSING',
        '| Path:', req.originalUrl);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.admin = decoded;
        console.log('[Auth] Success for:', decoded.email);
        next();
    } catch (err) {
        console.error('[Auth] JWT verify failed:', err.message);
        console.error('[Auth] JWT_SECRET exists:', !!env.JWT_SECRET,
            '| JWT_SECRET length:', env.JWT_SECRET?.length);
        return res.status(403).json({
            error: 'Invalid or expired token',
            details: err.message
        });
    }
};
