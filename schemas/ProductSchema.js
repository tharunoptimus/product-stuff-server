const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ProductSchema = new Schema({
    imgSrc: { type: String, trim: true },
    quantity: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    productName: { type: String, required: true, trim: true },
    productDescription: { type: String, required: true, trim: true },
    uuid: { type: String, required: true, trim: true, unique: true },
    addedBy: { type: Schema.Types.ObjectId, ref: "User" },
})

let Product = mongoose.model('Product', ProductSchema)
module.exports = Product