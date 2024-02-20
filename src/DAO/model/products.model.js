import mongoose from "mongoose";

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: {type: String, required: true, min: 3,max: 100},
    description: {type: String, required: true, min: 10,max: 500},
    price: {type: Number, required: true},
    thumbnail: {type: String, default: 'No image',required: false},
    code: {type: String, required: true, unique: true},
    stock: {type: Number, required: true, min: 1},
    status: {type: Boolean, default: true,required: false},
    category: {type: String, required: true, min: 1, max: 25}
})

const productModel = mongoose.model(productCollection, productSchema)


export default productModel
