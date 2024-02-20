import express from 'express'
import productModel from '../DAO/model/products.model.js';
import onlineProductManager from '../DAO/DBManagers/onlineProductsManager.controller.js'

const router = express.Router()

//Endpoints
router.get('/', async(req, res) => {
    try {
        let products = await productModel.find()
        console.log(products);
        res.send({result: 'success', payload: products})
    } catch (error) {
        res.send(error)
    }
})

router.get('/:pid', async(req, res) => {
    try {
        let response = await onlineProductManager.getProductById(req.params.pid)
        console.log(response);
        res.send(response)
    } catch (error) {
        res.send(error)
    }
    
})

router.post('/', async(req, res) => {
    try {
        let result = await onlineProductManager.addProduct(req.body)
        res.send(result)
    } catch (error) {
        res.send(error)
    }
})

router.put('/:pid', async(req, res) => {
    try {
        let result = await onlineProductManager.updateProduct(req.params.pid, req.body)
        res.send(result)
    } catch (error) {
        res.send(error)
    }
})

router.delete('/:pid', async(req, res) => {
    try {
        let result = await onlineProductManager.removeProduct(req.params.pid)
        res.send(result)
    } catch (error) {
        res.send(error)
    }
})

export default router