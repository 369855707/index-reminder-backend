const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

const accessTokenSecret = 'youraccesstokensecret'

const users = [
    {
        username: 'Victor',
        password: 'password123admin',
        role: 'admin'
    }, {
        username: 'Amanda',
        password: 'password123member',
        role: 'memeber'
    }
]


app.post('/login', (req, res) => {
    const { username, password } = req.body

    const user = users.find(u => {
        return u.username === username && u.password === password
    })

    if (user) {
        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret)
        res.json({ accessToken })
    } else {
        res.send('Username or Password incorrect')
    }
})

app.listen(3000, () => {
    console.log('Authentication service started on port 3000')
})