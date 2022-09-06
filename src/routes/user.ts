import express from 'express'
const router = express.Router();
import {RegisterUser,LoginUser,getUsers,getSingleUser,getUniqueUserProducts, redirectToDashboard, logout} from '../controller/userController'

router.get('/register',(req,res)=>{
    res.render('register')
})
router.post('/register',RegisterUser)

router.get('/login',(req,res)=>{
    res.render('login')
})

router.get('/dashboard', getUniqueUserProducts)

router.get('/dashboard', redirectToDashboard)



router.post('/login', LoginUser)
router.get('/allusers', getUsers)
router.get('/oneuser/:id',  getUniqueUserProducts)
//router.delete('/logout', logout)
router.get('/logout', logout)


export default router