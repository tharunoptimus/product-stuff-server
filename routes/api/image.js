const express = require("express")
const app = express()
const router = express.Router()
const { authenticateToken } = require("../../middleware")
const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage()})
const ImageKit = require("imagekit")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
	res.send({ message: "IMAGE Endpoint Active" })
})


module.exports = router