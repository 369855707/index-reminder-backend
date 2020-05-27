const express = require('express')
const jwt = require('jsonwebtoken')
const config = require('../config.json')
const router = express.Router()

const jwtUtil = require('./jwt.util')

router.post('/refresh', refreshToken);

function refreshToken(req, res, next) {
    const refreshToken = jwtUtil.extractToken(req);
    console.log("refreshToken : " + refreshToken);
    const { username, password } = req.body;
    //验证refreshToken
    jwt.verify(refreshToken, config.refresh_secret, (err, payload) => {
        //如果refresh token过期，verify是否会检测到
        console.log("payload : " + JSON.stringify(payload));
        if (err) return res.json({ status: 'failed', msg: err })
        //refresh token验证通过后，生成新access token 返回
        const newAccessToken = jwt.sign({ sub: payload.sub }, config.secret, { expiresIn: 60 });
        res.send({ status: 'ok', token: newAccessToken })
    })
}

//todo:
//1.前端生成access token，过期后用refresh token请求新新的access token
//2.前端用新的access token再次请求request (如何次请求，如何提出用户)
//3.如果refresh token过期，则返回错误，前端redirect用户到login页面

module.exports = router