const express = require("express")
const app = express()
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require("../../middleware")

const Product = require("../../schemas/ProductSchema")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
    res.send({ message: "Product Endpoint Active" })
})

router.get("/some/:skip/:limit", async (req, res) => {

    let skip = parseInt(req.params.skip)
    let limit = parseInt(req.params.limit)

    skip = isNaN(skip) ? 0 : skip
    limit = isNaN(limit) ? 10 : limit

    let products = await Product.find().skip(skip).limit(limit).catch((err) => {
        console.log(err)
        res.status(500).send({ message: "Server Error" })
    })

    res.status(200).send(products)
})

router.get("/all", async (_, res) => {
    let products = await Product.find().catch((err) => {
        console.log(err)
        res.status(500).send({ message: "Server Error" })
    })
    res.status(200).send(products)
})

router.get("/uuid/:uuid", async (req, res) => {
    let uuid = req.params.uuid
    if (!uuid) {
        res.status(400).send({ message: "Missing Fields UUID" })
        return
    }

    let product = await Product.findOne({ uuid }).catch((err) => {
        console.log(err)
        res.status(500).send({ message: "Server Error" })
    })

    if (!product) {
        res.status(404).send({ message: "Product Not Found" })
        return
    }

    res.status(200).send(product)

})

router.post("/", authenticateToken, async (req, res) => {
    let { productName, productDescription, price, quantity } = req.body

    if (!productName || !productDescription || !price || !quantity) {
        res.status(400).send({ message: "Missing Fields" })
        return
    }

    let uuid = uuidv4()

    let product = await Product.create({
        productName,
        productDescription,
        price,
        quantity,
        uuid,
        addedBy: req.user._id
    }).catch((err) => {
        console.log(err)
        return res.status(500).send({ message: "Server Error" })
    })

    res.status(201).send(product)
})

router.patch("/:uuid", authenticateToken, async (req, res) => {
    let uuid = req.params.uuid

    if (!uuid) {
        res.status(400).send({ message: "Missing Fields UUID" })
        return
    }

    let updateObj = req.body

    if (Object.keys(updateObj).length === 0) {
        return res.status(400).send({ message: "Missing Body" })
    }

    let product = await Product.findOneAndUpdate({ uuid }, updateObj, { new: true }).catch((err) => {
        console.log(err)
        return res.status(500).send({ message: "Server Error" })
    })

    if (!product) {
        return res.status(404).send({ message: "Product Not Found" })
    }

    res.sendStatus(204)
})

router.delete("/:uuid", authenticateToken, async (req, res) => {
    let uuid = req.params.uuid

    if (!uuid) {
        res.status(400).send({ message: "Missing Fields UUID" })
        return
    }

    let product = await Product.findOneAndDelete({ uuid }).catch((err) => {
        console.log(err)
        res.status(500).send({ message: "Server Error" })
    })

    if (!product) {
        res.status(404).send({ message: "Product Not Found" })
        return
    }

    res.sendStatus(204)

})

module.exports = router