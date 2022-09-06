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
        const postmanCreate = req.headers['postman-token'];
        if (postmanCreate) {
            res.status(201).json({
                msg: "You have successfully created a product",
                record,
            });
        }
        else {
            res.redirect('/users/dashboard');
        }
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
        const postmanGetAll = req.headers['postman-token'];
        if (postmanGetAll) {
            res.status(200).json({
                msg: "You have successfully fetched all products",
                //count: record,
                record: record
            });
        }
        else {
            res.render("index", { record });
        }
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
        //console.log("before");
        const { id } = req.params;
        //console.log("after");
        const record = await product_1.ProductInstance.findOne({ where: { id } });
        if (record) {
            const apiData = req.headers['postman-token'];
            if (apiData) {
                return res.status(200).json({ record });
            }
            else {
                res.render('edit', { record });
            }
        }
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read single product",
            route: "/read/:id",
        });
    }
}
exports.getSingleProduct = getSingleProduct;
async function updateProduct(req, res, next) {
    try {
        const { id } = req.params;
        const { name, image, brand, category, description, price, countInStock, rating, numReviews } = req.body;
        console.log("##########", req.body);
        const { error } = utils_1.updateProductSchema.validate(req.body, utils_1.options);
        if (error) {
            const msg = error.details.map(err => err.message).join(',');
            return res.status(400).json({
                Error: msg
            });
        }
        const record = await product_1.ProductInstance.findOne({ where: { id } });
        console.log("record", record);
        if (!record) {
            return res.status(404).json({
                Error: "Cannot find existing product",
            });
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
        });
        console.log("@@@@@", updatedrecord);
        const postmanUpdate = req.headers['postman-token'];
        if (postmanUpdate) {
            res.status(200).json({
                msg: "You have successfully updated your product",
                updatedrecord
            });
        }
        else {
            res.redirect('/users/dashboard');
        }
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
        console.log('Testing testing testing');
        const postmanDelete = req.headers['postman-token'];
        if (postmanDelete) {
            return res.status(200).json({
                msg: "Product deleted successfully",
                deletedRecord
            });
        }
        else {
            res.redirect('/users/dashboard');
        }
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to delete",
            route: "/delete/:id",
        });
    }
}
exports.deleteProduct = deleteProduct;
