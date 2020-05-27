const jwt = require('jsonwebtoken')

function refreshToken({ username, password, refreshToken }) {
    jwt.verify(refreshToken, 'wrong-secret', function (err, decoded) {
        // err
        if (err) {
            return err
        }
        // decoded undefined
        return res.json({ code: -1, msg: err })
    });
}

function extractToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}

module.exports = {
    refreshToken,
    extractToken
}