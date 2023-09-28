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


router.get("/all", async (_, res) => {
    let products = await Product.find().catch((err) => {
        console.log(err)
        res.sendStatus(400)
    })
    res.status(200).send(products)
})



module.exports = router