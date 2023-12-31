const express = require("express")
const app = express()
const router = express.Router()
const { authenticateToken } = require("../../middleware")
const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage()})
const ImageKit = require("imagekit")
const Product = require("../../schemas/ProductSchema")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
	res.send({ message: "IMAGE Endpoint Active" })
})

router.post("/:uuid", authenticateToken, upload.single("image"), async (req, res) => {

    let uuid = req.params.uuid

    if(uuid.trim() == "") {
        res.status(400).send({ message: "Missing Fields UUID" })
        return
    }
    
    let image = req.file

    if(!image) {
        res.status(400).send({ message: "Missing Fields Image" })
        return
    }

    let imageURL = await uploadImage(image, uuid).catch((err) => {
        console.log(err)
        res.status(400).send({ message: "Error Uploading Image" })
    })

    if(!imageURL) {
        res.status(400).send({ message: "Error Uploading Image" })
        return
    }

    let product = await Product.updateOne({ uuid }, { imgSrc: imageURL.url }, { new: true }).catch((err) => {
        console.log(err)
        res.status(500).send({ message: "Server Error" })
    })

    if(!product) {
        res.status(404).send({ message: "Product Not Found", imgSrc: imageURL.url })
        return
    }

    return res.status(200).send({imgSrc: imageURL.url})

})

async function uploadImage(image, uuid) {
    const imageKit = new ImageKit({
        publicKey : process.env.IMAGE_KIT_PUBLIC_KEY,
        privateKey : process.env.IMAGE_KIT_PRIVATE_KEY,
        urlEndpoint : process.env.IMAGE_KIT_URL_ENDPOINT
    })

    const response = await imageKit.upload({
        file : image.buffer,
        fileName : `${image.originalname}-${uuid}}`
    }).catch(err => {
        console.log(err)
        return null
    })

    return response
}

module.exports = router