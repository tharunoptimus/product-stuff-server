const express = require("express")
const app = express()
const bcrypt = require("bcryptjs")
const router = express.Router()
const jwt = require("jsonwebtoken")

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

        let newUser = await User.create({
            firstName,
            lastName,
            email,
            profilePic: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${firstName}.${lastName}?radius=50?backgroundColor=#4cf0c3?mood[]=happy`,
            username: `${firstName}.${lastName}`,
            password: hashedPassword
        }).catch((err) => {
            console.log(err)
            res.status(500).send({ message: "Server Error" })
            return
        })

        let token = generateJWTToken(newUser)
        newUser.token = token
       
        return res.status(201).send(newUser)

    }

})


function generateJWTToken({username, email, profilePic, _id, expiry = "7d"}) {
    return jwt.sign(
        {
            username,
            email,
            profilePic,
            _id
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: expiry }
    )
}

module.exports = router