import express from 'express'
import {auth} from '../middleware/auth'

const router = express.Router();

import {Products, getProducts,getSingleProduct,updateProduct,deleteProduct} from '../controller/productController'

router.post('/create', auth,  Products);
router.get('/read',getProducts)
router.get('/read/:id',getSingleProduct)
router.patch('/update/:id',auth,updateProduct)
router.delete('/delete/:id',auth,deleteProduct)


export default router
