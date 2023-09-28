const mongoose = require("mongoose")
const Schema = mongoose.Schema
const UserSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, default: "", trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    profilePic: { type: String, default: "" },
    password: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    token: { type: String, default: "" },
    productsAdded: [{ type: Schema.Types.ObjectId, ref: "Product" }]
})

let User = mongoose.model('User', UserSchema)
module.exports = User