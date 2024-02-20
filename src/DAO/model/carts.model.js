import mongoose from "mongoose";

const cartsCollection = 'carts'

const productSchema = new mongoose.Schema({
    productId: { type: String, required: true }, 
    product: {type: Array, required: true},
    quantity: { type: Number, default: 0} 
});

const cartSchema = new mongoose.Schema({
    product: [productSchema]
})
const cartsModel = mongoose.model(cartsCollection, cartSchema)

export default cartsModel