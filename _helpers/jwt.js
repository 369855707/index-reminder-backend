const expressJwt = require('express-jwt')
const config = require('../config.json')
const userService = require('../users/user.service')


function jwt() {
    console.log('###come into jwt')
    const secret = config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            'users/authenticate',
            'users/register'
        ]
    })
}

async function isRevoked(req, payload, done) {
    console.log('###come into isRevoked')
    const user = await userService.getById(payload.sub);

    if (!user) {
        return done(null, true);
    }

    done();
}


module.exports = jwt;