import cartModel from '../model/carts.model.js'
import productModel from '../model/products.model.js';

// const productModel = productModelExports.productModel;


class OnlineCartsManager{
    constructor(){

    }

    /**
     * Description
     * @returns {any}
     */
    async createCart() {
        try {
            const nuevoCart = await cartModel.create({quantity: 0});
            return `Cart created. ID: ${nuevoCart._id}`;
        } catch (error) {
            console.error('Error al crear un nuevo carrito:', error);
            throw error;
        }
    }
    

    /**
     * Description
     * @param {any} cid
     * @returns {any}
     */
    async getCartById(cid){
        try {
            const cart = await cartModel.findOne({ _id: cid });
            return cart
        } catch (error) {
            return `Error getting the cart. Error: ${error}`
        }
    }

    /**
     * Description
     * @param {any} cid
     * @param {any} pid
     * @returns {any}
     */
    async addProductToCart(cid, pid) {
        try {
            // Encuentra el carrito por su ID
            const cartExists = await cartModel.findById(cid);
            if (!cartExists) {
                return 'Cart not found';
            }
    
            // Encuentra el producto por su ID
            const productExists = await productModel.findById(pid);
            if (!productExists) {
                return 'Product not found';
            }
    
            // Verifica si el producto ya está en el carrito
            const existingProductIndex = cartExists.product.findIndex(item => item.productId.toString() === pid.toString());
            if (existingProductIndex !== -1) {
                // Si el producto ya está en el carrito, aumenta la cantidad
                let quantity = cartExists.product[existingProductIndex].quantity += 1;
                await cartExists.save();
                let product = cartExists.product.find(item => item.productId === pid)
                let productTitle = product.product[0].title
                return `Product added. Title: ${productTitle}, quantity: ${quantity}`
            } else {
                // Si el producto no está en el carrito, agrégalo con cantidad 1
                cartExists.product.push({ productId: pid, product: productExists, quantity: 1 });
            }
    
            // Guarda el carrito modificado en la base de datos
            await cartExists.save();
    
            return 'Product added to cart successfully';
        } catch (error) {
            return `Error adding product to the cart. Error: ${error}`;
        }
    }

}

const onlineCartsManager = new OnlineCartsManager

export default onlineCartsManager