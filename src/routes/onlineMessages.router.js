import express from 'express'
import messageModel from '../DAO/model/products.model.js'

const router = express.Router()

//Endpoints
router.get('/', async(req, res)=>{
    res.render('chat')
})

export default router