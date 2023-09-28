require('dotenv').config()

const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {

    const ACCECPTED_ROUTES = [ "GET", "OPTIONS", "HEAD" ]
    if(ACCECPTED_ROUTES.includes(req.method)) {
        next()
        return
    }

    let authHeader = req.headers['authorization']
    let token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.status(403).send({ message: "Invalid Token" })
        req.user = user
        next()
    })
}

module.exports = { authenticateToken }