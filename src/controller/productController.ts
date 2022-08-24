import { name } from "ejs";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { ProductInstance } from "../model/product";
import { UserInstance } from "../model/user";
import { createTodoSchema, options, updateProductSchema } from "../utils/utils";


export async function Products(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  const id = uuidv4();
//   let todo = {...req.body, id}
  try {
    const verified = req.user;
    const validationResult = createTodoSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    const record = await ProductInstance.create({
      id,
      ...req.body,
      userId: verified.id,
    });
    const postmanCreate = req.headers['postman-token']
    if(postmanCreate){
        res.status(201).json({
        msg: "You have successfully created a product",
        record,
    });
    }else{
      res.redirect('/users/dashboard')
    }
    // res.status(201).json({
    //   msg: "You have successfully created a product",
    //   record,
    // });
  } catch (err) {
    res.status(500).json({
      msg: "failed to create",
      route: "/create",
    });
  }
}

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = req.query?.limit as number | undefined;
    const offset = req.query?.offset as number | undefined;
    //  const record = await ProductInstance.findAll({where: {},limit, offset})
    const record = await ProductInstance.findAll({ limit, offset,
      include:[{
         model:UserInstance,
         attributes:['id', 'fullname', 'email', 'gender', 'phone', 'address'],
         as:'user'
        }
        ]
   });
   const postmanGetAll = req.headers['postman-token']
   if (postmanGetAll) {
      res.status(200).json({
      msg: "You have successfully fetched all products",
      //count: record,
      record: record
    });
   }else{
     res.render("index", {record})
   }
    // res.status(200).json({
    //   msg: "You have successfully fetched all products",
    //   //count: record,
    //   record: record
    // });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({
      msg: "failed to read",
      route: "/read",
    });
  }
}

export async function getSingleProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //console.log("before");
    
    const { id } = req.params;
    //console.log("after");
    const record = await ProductInstance.findOne({ where: { id } });
    if(record){
      const apiData = req.headers['postman-token'];
      if (apiData){
        return res.status(200).json({record})
      }else{
res.render('edit', {record})
      }
      }


    
  } catch (error) {
    res.status(500).json({
      msg: "failed to read single product",
      route: "/read/:id",
    });
  }
}


export async function updateProduct(req:Request, res:Response, next:NextFunction) {
  try{ 
     const  {id} = req.params
     const {name,
            image,
            brand,
            category,
            description,
            price,
            countInStock,
            rating,
            numReviews } = req.body;
            console.log("##########", req.body)
     const {error} = updateProductSchema.validate(req.body,options)
       if( error){
          const msg = error.details.map(err => err.message).join(',')
          return res.status(400).json({
             Error:msg
          })
       }
     const record = await ProductInstance.findOne({where: {id}})
     console.log("record", record)
      if(!record){
        return res.status(404).json({
           Error:"Cannot find existing product",
        })
      }
      const updatedrecord = await record.update({
        name,
        image,
        brand,
        category,
        description,
        price,
        countInStock,
        rating,
        numReviews
      })
      console.log("@@@@@", updatedrecord)
      const postmanUpdate = req.headers['postman-token']
      if(postmanUpdate){
        res.status(200).json({
          msg: "You have successfully updated your product",
          updatedrecord
        });
      }else{
        res.redirect('/users/dashboard')
      }
      // res.status(200).json({
      //         msg: "You have successfully updated your product",
      //         updatedrecord,
      //       });
     
 }catch(error){
   res.status(500).json({
      msg:"failed to update",
      route:"/update/:id"
   })
 }
 }


export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const record = await ProductInstance.findOne({ where: { id } });
    if (!record) {
      return res.status(404).json({
        msg: "Cannot find product",
      });
    }
    const deletedRecord = await record.destroy();
    console.log('Testing testing testing')
    const postmanDelete = req.headers['postman-token'];
    if(postmanDelete){
      return res.status(200).json({
        msg: "Product deleted successfully",
        deletedRecord
      });
    }else{
      res.redirect('/users/dashboard')
    }

  } catch (error) {
    res.status(500).json({
      msg: "failed to delete",
      route: "/delete/:id",
    });
  }
}
