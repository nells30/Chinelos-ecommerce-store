import express from 'express'
import { getProducts } from '../controller/productController'

const router = express.Router()

router.get('/', getProducts)

export default router