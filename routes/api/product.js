const express = require("express")
const app = express()
const router = express.Router()
const { authenticateToken } = require("../../middleware")

const Product = require("../../schemas/ProductSchema")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
    res.send({ message: "Product Endpoint Active" })
})


module.exports = router