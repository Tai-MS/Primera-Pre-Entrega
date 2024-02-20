import productModel from '../model/products.model.js'

class OnlineProductManager{
    constructor(){
        this.path = './src/json/products.json'
        this.products = []
        this.counter = 1
    }

    /**
     * Description
     * @param {any} productData
     * @returns {any}
     */
    async addProduct(productData){
        try {
            const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'category'];
            const missingField = requiredFields.find(field => !(field in productData));
            if (missingField) {
                console.log(`Complete all fields. Needed: ${missingField}`);
                return `Complete all fields. Needed: ${missingField}`;
            }

            const existingProductCode = await productModel.findOne({ code: productData.code });
            if (existingProductCode) {
                console.log(`The product code already exists: ${productData.code}`);
                return `The product code already exists: ${productData.code}`
            }

            const newProduct = new productModel({
                ...productData
            })
            
            // const savedProduct = await newProduct.save();
            const savedProduct = await productModel.create(newProduct);
            console.log(savedProduct); // Comprueba si el producto se guardó correctamente
            return `Product added: ${newProduct.title}`
        } catch (error) {
            return `Error adding the product. Error: ${error}` 
        }
    }

    /**
     * Description
     * @param {any} pid
     * @returns {any}
     */
    async getProductById(pid){
        try {
            const productId = await productModel.findOne({_id: pid});
            return productId
        } catch (error) {
            console.log(error);
            return error
        }  
    }

    /**
     * Description
     * @param {any} pid
     * @param {any} updatedFields
     * @returns {any}
     */
    async updateProduct(pid, updatedFields){
        try {
            const productId = await productModel.findOne({_id: pid});
           
            if(productId){
                const existingProductCode = await productModel.findOne({ code: updatedFields.code });
                if (existingProductCode && existingProductCode._id.toString() !== pid) {
                    return `The product code already exists: ${updatedFields.code}`;
                } else {
                    await productModel.updateOne({_id: pid}, updatedFields);
                    return `Product updated. \n ${productId}`;
                }
            }
        } catch (error) {
            return `Not found`
        }
    }

    /**
     * Description
     * @param {any} pid
     * @returns {any}
     */
    async removeProduct(pid){
        try {
            const productId = await productModel.findOne({_id: pid});
            if(productId){
                await productModel.deleteOne({_id: pid})
                return 'Product removed'
            }else{
                return `Not found`
            }
            
        } catch (error) {
            return `Error removing product. Error ${error}`
        }
    }
}

const onlineProductManager = new OnlineProductManager

export default onlineProductManager