import Joi from 'joi'
import jwt from 'jsonwebtoken'

export const createTodoSchema = Joi.object().keys({
    // title:Joi.string().lowercase().required(),
    // completed:Joi.boolean().required(),

    name: Joi.string().lowercase().required(),
    image: Joi.string().lowercase().required(),
    brand: Joi.string().lowercase().required(),
    category: Joi.string().lowercase().required(),
    description: Joi.string().lowercase().required(),
    price: Joi.number().required(),
    countInStock: Joi.number().required(),
    rating: Joi.number().required(),
    numReviews: Joi.number().required(),
});

export const updateProductSchema = Joi.object().keys({
    name:Joi.string(),
    image:Joi.string(),
    brand:Joi.string(),
    category:Joi.string(),
    description:Joi.string(),
    price:Joi.number(),
    countInStock:Joi.number(),
    rating:Joi.number(),
    numReviews:Joi.number()
});


export const registerSchema = Joi.object().keys({
    fullname:Joi.string().required(),
    email:Joi.string().trim().lowercase().required(),
    gender:Joi.string().required(),
    phone:Joi.string().length(11).pattern(/^[0-9]+$/).required(),
    address:Joi.string().required(),
    password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    confirm_password:Joi.ref("password")
}).with('password', 'confirm_password')



export const loginSchema = Joi.object().keys({
    email:Joi.string().trim().lowercase().required(),
    password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  
})

//Generate Token
export const generateToken=(user:{[key:string]:unknown}):unknown=>{
  const pass = process.env.JWT_SECRET as string
   return jwt.sign(user,pass, {expiresIn:'7d'})
}

export const options ={  
    abortEarly:false,
    errors:{
        wrap:{
            label: ''
        }
    }
}