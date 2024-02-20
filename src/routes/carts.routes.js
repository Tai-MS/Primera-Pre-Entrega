import express from 'express'
import cartManager from '../DAO/FSManagers/cartsManager.controller.js'

const router = express.Router()

//Endpoints
router.post('/', async (req, res) => {
    try {
        const result = await cartManager.createCart();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:cid', async(req, res) => {
    try {
        const result = await cartManager.getCartByID(req.params.cid)
        res.json(result)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/:cid/product/:pid', (req, res) => {
    res.json(cartManager.addProductToCart(req.params.cid, req.params.pid))
})


export default router