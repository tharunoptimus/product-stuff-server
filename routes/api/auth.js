const express = require("express")
const app = express()
const bcrypt = require("bcryptjs")
const router = express.Router()
const jwt = require("jsonwebtoken")
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const FIRE_API_ENDPOINT = "https://fire.adaptable.app/api/tokens/verify"

const User = require("../../schemas/UserSchema")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
	res.send({ message: "AUTH Endpoint Active" })
})

router.post("/register", async (req, res) => {
    
    let firstName = req.body.firstName.trim()
    let lastName = req.body.lastName.trim()
    let email = req.body.email.trim()
    let password = req.body.password.trim()


    if (!firstName || !lastName || !email || !password) {
        res.status(400).send({ message: "Missing Fields" })
        return
    }
    
    let user = await User.findOne({ email }).catch((err) => {
        res.status(500).send({ message: "Server Error" })
        return
    })

    if(user == null) {

        let hashedPassword = await bcrypt.hash(password, 10)

        let newUser = await registerNewUser({ 
            firstName, 
            lastName, 
            email, 
            profilePic: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${firstName}.${lastName}?radius=50?backgroundColor=#4cf0c3?mood[]=happy`, 
            username: `${firstName}.${lastName}`, 
            password: hashedPassword 
        })

        if (newUser == null) {
            res.status(500).send({ message: "Server Error" })
            return
        }

        return res.status(201).send(newUser)

    }

})

async function registerNewUser({ firstName, lastName, email, profilePic, username, hashedPassword }) {

    let newUser = await User.create({
        firstName,
        lastName,
        email,
        profilePic,
        username,
        password: hashedPassword
    }).catch((err) => {
        console.log(err)
        res.status(500).send({ message: "Server Error" })
        return null
    })

    let token = generateJWTToken(newUser)
    newUser.token = token

    return newUser

}

router.post("/login", async (req, res) => {
    let { email: emailOrUsernameString, password } = req.body

    emailOrUsernameString = emailOrUsernameString.trim()
    password = password.trim()

    if (!emailOrUsernameString || !password) {
        res.status(400).send({ message: "Missing Fields" })
        return
    }

    let user = await User.findOne({
        $or: [{ email: emailOrUsernameString }, { username: emailOrUsernameString }]
    }).catch((err) => {
        console.log(err)
        res.status(500).send({ message: "Server Error" })
        return
    })

    if (user == null) {
        res.status(400).send({ message: "User Not Found" })
        return
    }

    let result = await bcrypt.compare(password, user.password)

    if (result == false) {
        res.status(401).send({ message: "Incorrect Password" })
        return
    }

    let token = generateJWTToken(user)
    user.token = token


    res.status(200).send(user)

})

app.post("/fireoauth", async (req, res) => {

    let { token: fireOAuthToken } = req.body
    
    if (!fireOAuthToken) {
        res.status(400).send({ message: "Missing Fields" })
        return
    }

    let response = await fetch(FIRE_API_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: fireOAuthToken })
    })

    let data = await response.json()

    let { email, firstName, lastName, profilePic } = data

    let user = await User.findOne({ email }).catch((err) => {
        res.status(500).send({ message: "Server Error" })
        return
    })

    if (user == null) {

        let newUser = await registerNewUser({ 
            firstName, 
            lastName, 
            email, 
            profilePic, 
            username: `${firstName}.${lastName}`, 
            password: "fireoauth" 
        })

        if (newUser == null) {
            res.status(500).send({ message: "Server Error" })
            return
        }

        return res.status(201).send(newUser)

    }

    let token = generateJWTToken(user)
    user.token = token

    res.status(200).send(user)

})

app.post("/verify", async (req, res) => {
    let { token } = req.body

    if (!token) {
        res.status(400).send({ message: "Missing Fields" })
        return
    }

    let decoded = verifyAndExtractToken(token)

    if (decoded == null) {
        res.status(401).send({ message: "Invalid Token" })
        return
    }

    let user = await User.findOne({ _id: decoded._id }).catch((err) => {
        res.status(500).send({ message: "Server Error" })
        return
    })

    if (user == null) {
        res.status(401).send({ message: "User Not Found" })
        return
    }

    let newToken = generateJWTToken(user)
    user.token = newToken

    res.status(200).send(user)
})

function generateJWTToken({_id, expiry = "7d"}) {
    return jwt.sign(
        {
            _id
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: expiry }
    )
}

function verifyAndExtractToken(token) {
    try {
        let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        return decoded
    } catch (err) {
        return null
    }
}

module.exports = router