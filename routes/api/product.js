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

router.get("/:uuid", async (req, res) => {
    let uuid = req.params.uuid
    if (!uuid) {
        res.status(400).send({ message: "Missing Fields UUID" })
        return
    }

    let product = await Product.findOne({ uuid }).catch((err) => {
        console.log(err)
        res.sendStatus(400)
    })

    if (!product) {
        res.status(404).send({ message: "Product Not Found" })
        return
    }

    res.status(200).send(product)

})

router.patch("/:uuid", authenticateToken, async (req, res) => {
    let uuid = req.params.uuid

    if (!uuid) {
        res.status(400).send({ message: "Missing Fields UUID" })
        return
    }

    let updateObj = req.body

    let product = await Product.findOneAndUpdate({ uuid }, updateObj, { new: true }).catch((err) => {
        console.log(err)
        res.status(304).send({ message: "Something went wrong" })
    })

    if (!product) {
        res.status(404).send({ message: "Product Not Found" })
        return
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
        res.status(304).send({ message: "Something went wrong" })
    })

    if (!product) {
        res.status(404).send({ message: "Product Not Found" })
        return
    }

    res.sendStatus(204)

})

module.exports = router