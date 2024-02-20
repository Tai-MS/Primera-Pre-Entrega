import express from 'express'

const router = express.Router() 

//Endpoints
router.get('/', (req, res) => {
    res.render('realTimeProducts', {})
})

export default router