import express from 'express'
import {auth} from '../middleware/auth'

const router = express.Router();

import {Products, getProducts,getSingleProduct,updateProduct,deleteProduct} from '../controller/productController'
router.get('/create',(req,res)=>{
    res.render('create')
})
router.post('/create', auth,  Products);
router.get('/:id/edit',async (req,res,next)=>{
    let record = await getSingleProduct(req,res,next)
    res.render('edit',{record})
})
router.post('/:id',auth,updateProduct)
router.get('/read',getProducts)

//router.get('/read/:id',getSingleProduct)
router.post('/update/:id',auth,updateProduct)

router.post('/delete/:id',auth,deleteProduct)


export default router
