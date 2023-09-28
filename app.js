const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const app = express()
const cors = require("cors")
require("./database")
const port = process.env.PORT || 3003

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// API Routes
let authAPI = require("./routes/api/auth")
let imageAPI = require("./routes/api/image")
let productAPI = require("./routes/api/product")

app.use("/api/auth/", authAPI)
app.use("/api/image/", imageAPI)
app.use("/api/product/", productAPI)

app.get("/", (_, res) => {
	res.status(200).send({ text: "API ENDPOINT ACTIVE" })
})