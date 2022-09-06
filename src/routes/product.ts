import express from 'express'
import {auth} from '../middleware/auth'

const router = express.Router();

import {Products, getProducts,getSingleProduct,updateProduct,deleteProduct} from '../controller/productController'

router.get('/', getProducts)

router.get('/create',(req,res)=>{
    res.render('create')
})
router.post('/create', auth,  Products);



// router.get('/:id',async (req,res,next)=>{
//     let record = await getSingleProduct(req,res,next)
//     res.render('edit',{record})
// })
// router.get('/')

router.post('/:id',auth,updateProduct)


router.get('/update/:id', getSingleProduct)
router.post('/update/:id',auth,updateProduct)

router.post('/delete/:id',auth,deleteProduct)
router.delete('/delete/:id',auth,deleteProduct)


export default router
