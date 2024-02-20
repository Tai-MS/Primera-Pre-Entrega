import express from 'express'
import productManager from '../DAO/FSManagers/productsManager.controller.js'

const router = express.Router()

//Endpoints
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit)

    if(!isNaN(limit) && limit > 0){
        const limitedProducts = productManager.getProducts().slice(0, limit)

        if(limitedProducts.length > 0){
            res.json(limitedProducts)
        }else{
            res.json(productManager.getProducts())
        }
    }else{
        res.json(productManager.getProducts())
    }
})

router.get('/:pid', (req, res) => {
    res.send(productManager.getProductsById(req.params.pid))
})

router.post('/', (req, res) => {
    res.send(productManager.addProduct(req.body))
})

router.put('/:pid', async(req, res)=>{
    try {
        let result = await productManager.updateProduct(req.params.pid, req.body);
        res.send(result);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
})

router.delete('/:pid', async(req, res)=>{
    try {
        let result = await productManager.removeProduct(req.params.pid);
        res.send(result);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
})

export default router