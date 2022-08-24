import express,{Request,Response,NextFunction}
 from 'express'
 import {v4 as uuidv4} from 'uuid'
 import {registerSchema,options,loginSchema,generateToken} from '../utils/utils'
 import {UserInstance } from '../model/user'
 import bcrypt from 'bcryptjs'
import { ProductInstance } from '../model/product'

export async function RegisterUser(req:Request, res:Response, next:NextFunction) {
    const id = uuidv4()
    try{ 
        const validationResult = registerSchema.validate(req.body,options)
      if( validationResult.error){
           return res.status(400).json({
              Error:validationResult.error.details[0].message
           })
        }
        const duplicatEmail = await UserInstance.findOne({where:{email:req.body.email}})
        if(duplicatEmail){
         return res.status(409).json({
            msg:"Email is used, please change email"
         })
        }

        const duplicatePhone = await UserInstance.findOne({where:{phone:req.body.phone}})

        if(duplicatePhone){
         return res.status(409).json({
            msg:"Phone number is used"
         })
        }
      
        const passwordHash = await bcrypt.hash(req.body.password, 8)
      const record = await UserInstance.create({ 
          id:id,
          fullname:req.body.fullname,
          email:req.body.email,
          gender:req.body.gender,
          phone:req.body.phone,
          address:req.body.address,
          password:passwordHash
        })

        const postmanRegisterUser = req.headers['postman-token']
        if(postmanRegisterUser){
         res.status(201).json({
           msg:"You have successfully registered a user",
           record
         })
        }else{
         res.redirect('/users/login')
        }
      //  res.status(201).json({
      //      msg:"You have successfully registered a user",
      //      record
      //  })
    }catch(err){
       res.status(500).json({
        msg:'failed to register',
        route:'/register'
       })
    }
 
 }


 export async function LoginUser(req:Request, res:Response, next:NextFunction) {
   const id = uuidv4()
   try{ 
       const validationResult = loginSchema.validate(req.body,options)
       if( validationResult.error){
          return res.status(400).json({
             Error:validationResult.error.details[0].message
          })
       }
       const User = await UserInstance.findOne({where:{email:req.body.email}}) as unknown as {[key:string]:string}
        
       const {id} =User
       const token = generateToken({id})
      const validUser = await bcrypt.compare(req.body.password, User.password);

      if(!validUser){
         res.status(401).json({
            message:"Password do not match"
        })
      }

      if(validUser){

         res.cookie("token",token,{
            httpOnly:true,
            maxAge:1000 * 60 * 60 * 24
         });
         res.cookie("id",id,{
            httpOnly:true,
            maxAge: 1000 * 60 * 60 * 24
         })
         const postmanLoginUser = req.headers['postman-token']
         if(postmanLoginUser){
            res.status(200).json({
            message:"Successfully logged in",
            token,
            User
         })
         }else{
            res.redirect('/users/dashboard')
         }
         // res.status(200).json({
         //     message:"Successfully logged in",
         //     token,
         //     User

         // })
      }

}catch(err){
   res.status(500).json({
    msg:'failed to login',
    route:'/login'
   })
}

}


export async function getUsers(
   req: Request,
   res: Response,
   next: NextFunction
 ) {
   try {
     const limit = req.query?.limit as number | undefined;
     const offset = req.query?.offset as number | undefined;
     //  const record = await TodoInstance.findAll({where: {},limit, offset})
     const record = await UserInstance.findAndCountAll({ limit, offset,
     include:[{
      model:ProductInstance,
      as:'product'
     }
     ]
     });
     res.status(200).json({
       msg: "You have successfully fetched all users",
       count: record.count-1,
       record: record.rows,
     });
   } catch (error) {
     res.status(500).json({
       msg: "failed to read",
       route: "/read",
     });
   }
 }

 export async function getSingleUser(
   req: Request,
   res: Response,
   next: NextFunction
 ) {
   try {
      const { id } = req.params;
   //   const limit = req.query?.limit as number | undefined;
   //   const offset = req.query?.offset as number | undefined;
     //  const record = await TodoInstance.findAll({where: {},limit, offset})
     const record = await UserInstance.findOne({ where: {id},
     include:[{
      model:ProductInstance,
      as:'product',
      attributes:[
         "id",
         "fullname",
         "email",
         "gender",
         "phone",
         "address",
         "password"
      ]
     }]
     });
     res.status(200).json({
       msg: "You have successfully fetched this user",
       record
     });
   } catch (error) {
     res.status(500).json({
       msg: "failed to fetch this user",
       route: "/read",
     });
   }
 }

 export async function getUniqueUserProducts(req:Request, res:Response, next:NextFunction) {
   let id = req.cookies.id
   try{
      const record = await UserInstance.findOne({ where : {id}, 
      include:[{
         model:ProductInstance,
         as:'product'
      }]});
      const postmanGetUniqueUserProducts = req.headers['postman-token']
      if(postmanGetUniqueUserProducts){
         return res.status(200).json({
            record
         })
      }
      res.render("dashboard", {record})
   }catch (error) {
      res.status(500).json({
         msg:"failed to read",
         route: "/read"
      });
   }
   
 }



 export async function redirectToDashboard(req:Request, res:Response, next:NextFunction) {
   let id = req.cookies.id
   try{
      const record = await UserInstance.findOne({ where : {id}, 
      include:[{
         model:ProductInstance,
         as:'product'
      }]});
      res.redirect("/users/dashboard")
   }catch (error) {
      res.status(500).json({
         msg:"failed to read",
         route: "/read"
      });
   }
   
 }


 export async function logout(req:Request, res:Response){

   res.clearCookie('token')

   // res.status(200).json({

   //    message: "you have succesfully logged out"

   // })

   res.redirect("/")

}