import express from 'express'
import cartModel from '../DAO/model/carts.model.js'
import onlineCartsManager from '../DAO/DBManagers/onlineCartsManager.controller.js'

const router = express.Router()

//Endpoints
router.get('/', async(req, res)=>{
    try {
        let carts = await cartModel.find()
        res.send(carts)
    } catch (error) {
        res.send(error)
    }
})

router.get('/:cid', async(req, res) => {
    try {
        let response = await onlineCartsManager.getCartById(req.params.cid)
        res.send(response)
    } catch (error) {
        res.send(error)
    }
})

router.post('/', async(req, res) => {
    try {
        let response = await onlineCartsManager.createCart()
        res.send(response)
    } catch (error) {
        res.send(error)
    }
})

router.post('/:cid/product/:pid', async(req, res) => {
    try {
       let response = await onlineCartsManager.addProductToCart(req.params.cid, req.params.pid) 
        res.send(response)
    } catch (error) {
        res.send(error)
    }
})

export default router