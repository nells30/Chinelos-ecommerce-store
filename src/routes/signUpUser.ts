import express from 'express'

const router = express.Router()

router.get('/register',(req, res)=>{
    res.render('signUpUser', {title:"register"})
})

export default router