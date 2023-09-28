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