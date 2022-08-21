import express from 'express'
const router = express.Router();
import {RegisterUser,LoginUser,getUsers,getSingleUser,getUniqueUserProducts} from '../controller/userController'

router.get('/register',(req,res)=>{
    res.render('register')
})
router.post('/register',RegisterUser)

router.get('/login',(req,res)=>{
    res.render('login')
})

router.get('/dashboard',getUniqueUserProducts)
router.post('/login',LoginUser)
router.get('/allusers', getUsers)
router.get('/oneuser/:id', getSingleUser)


export default router