"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getSingleProduct = exports.getProducts = exports.Products = void 0;
const uuid_1 = require("uuid");
const product_1 = require("../model/product");
const user_1 = require("../model/user");
const utils_1 = require("../utils/utils");
async function Products(req, res, next) {
    const id = (0, uuid_1.v4)();
    //   let todo = {...req.body, id}
    try {
        const verified = req.user;
        const validationResult = utils_1.createTodoSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const record = await product_1.ProductInstance.create({
            id,
            ...req.body,
            userId: verified.id,
        });
        res.redirect('/users/dashboard');
        // res.status(201).json({
        //   msg: "You have successfully created a product",
        //   record,
        // });
    }
    catch (err) {
        res.status(500).json({
            msg: "failed to create",
            route: "/create",
        });
    }
}
exports.Products = Products;
async function getProducts(req, res, next) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        //  const record = await ProductInstance.findAll({where: {},limit, offset})
        const record = await product_1.ProductInstance.findAll({ limit, offset,
            include: [{
                    model: user_1.UserInstance,
                    attributes: ['id', 'fullname', 'email', 'gender', 'phone', 'address'],
                    as: 'user'
                }
            ]
        });
        res.render("index", { record });
        // res.status(200).json({
        //   msg: "You have successfully fetched all products",
        //   //count: record,
        //   record: record
        // });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "failed to read",
            route: "/read",
        });
    }
}
exports.getProducts = getProducts;
async function getSingleProduct(req, res, next) {
    try {
        const { id } = req.params;
        const record = await product_1.ProductInstance.findOne({ where: { id } });
        if (record) {
            return record;
        }
        else {
            res.status(400).json({ msg: "product not found" });
        }
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read single todo",
            route: "/read/:id",
        });
    }
}
exports.getSingleProduct = getSingleProduct;
// export async function updateProduct(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const { id } = req.params;
//     const {name,
//       image,
//       brand,
//       category,
//       description,
//       price,
//       countInStock,
//       rating,
//       numReviews } = req.body;
//     const validationResult = updateTodoSchema.validate(req.body, options);
//     if (validationResult.error) {
//       return res.status(400).json({
//         Error: validationResult.error.details[0].message,
//       });
//     }
//     const record = await ProductInstance.findOne({ where: { id } });
//     if (!record) {
//       return res.status(404).json({
//         Error: "Cannot find existing product",
//       });
//     }
//     const updatedrecord = await record.update({
//       name: name,
//       image: image,
//       brand: brand,
//       category: category,
//       description: description,
//       price: price,
//       countInStock: countInStock,
//       rating: rating,
//       numReviews: numReviews
//     });
//     res.status(200).json({
//       msg: "You have successfully updated your product",
//       updatedrecord,
//     });
//   } catch (error) {
//     res.status(500).json({
//       msg: "failed to update",
//       route: "/update/:id",
//     });
//   }
// }
async function updateProduct(req, res, next) {
    try {
        const { id } = req.params;
        const { name, image, brand, category, description, price, countInStock, rating, numReviews } = req.body;
        const { error } = utils_1.updateTodoSchema.validate(req.body, utils_1.options);
        if (error) {
            const msg = error.details.map(err => err.message).join(',');
            return res.status(400).json({
                Error: msg
            });
        }
        const record = await product_1.ProductInstance.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({
                Error: "Cannot find existing todo",
            });
        }
        const updatedrecord = await record.update({
            name: name,
            image: image,
            brand: brand,
            category: category,
            description: description,
            price: price,
            countInStock: countInStock,
            rating: rating,
            numReviews: numReviews
        });
        res.redirect('/users/dashboard');
        // res.status(200).json({
        //         msg: "You have successfully updated your product",
        //         updatedrecord,
        //       });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to update",
            route: "/update/:id"
        });
    }
}
exports.updateProduct = updateProduct;
async function deleteProduct(req, res, next) {
    try {
        const { id } = req.params;
        const record = await product_1.ProductInstance.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({
                msg: "Cannot find product",
            });
        }
        const deletedRecord = await record.destroy();
        res.redirect('/products/dashboard');
        // return res.status(200).json({
        //   msg: "Product deleted successfully",
        //   deletedRecord,
        // });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to delete",
            route: "/delete/:id",
        });
    }
}
exports.deleteProduct = deleteProduct;
