"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.redirectToDashboard = exports.getUniqueUserProducts = exports.getSingleUser = exports.getUsers = exports.LoginUser = exports.RegisterUser = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../utils/utils");
const user_1 = require("../model/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const product_1 = require("../model/product");
async function RegisterUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const validationResult = utils_1.registerSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message
            });
        }
        const duplicatEmail = await user_1.UserInstance.findOne({ where: { email: req.body.email } });
        if (duplicatEmail) {
            return res.status(409).json({
                msg: "Email is used, please change email"
            });
        }
        const duplicatePhone = await user_1.UserInstance.findOne({ where: { phone: req.body.phone } });
        if (duplicatePhone) {
            return res.status(409).json({
                msg: "Phone number is used"
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 8);
        const record = await user_1.UserInstance.create({
            id: id,
            fullname: req.body.fullname,
            email: req.body.email,
            gender: req.body.gender,
            phone: req.body.phone,
            address: req.body.address,
            password: passwordHash
        });
        const postmanRegisterUser = req.headers['postman-token'];
        if (postmanRegisterUser) {
            res.status(201).json({
                msg: "You have successfully registered a user",
                record
            });
        }
        else {
            res.redirect('/users/login');
        }
        //  res.status(201).json({
        //      msg:"You have successfully registered a user",
        //      record
        //  })
    }
    catch (err) {
        res.status(500).json({
            msg: 'failed to register',
            route: '/register'
        });
    }
}
exports.RegisterUser = RegisterUser;
async function LoginUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const validationResult = utils_1.loginSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message
            });
        }
        const User = await user_1.UserInstance.findOne({ where: { email: req.body.email } });
        const { id } = User;
        const token = (0, utils_1.generateToken)({ id });
        const validUser = await bcryptjs_1.default.compare(req.body.password, User.password);
        if (!validUser) {
            res.status(401).json({
                message: "Password do not match"
            });
        }
        if (validUser) {
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24
            });
            res.cookie("id", id, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24
            });
            const postmanLoginUser = req.headers['postman-token'];
            if (postmanLoginUser) {
                res.status(200).json({
                    message: "Successfully logged in",
                    token,
                    User
                });
            }
            else {
                res.redirect('/users/dashboard');
            }
            // res.status(200).json({
            //     message:"Successfully logged in",
            //     token,
            //     User
            // })
        }
    }
    catch (err) {
        res.status(500).json({
            msg: 'failed to login',
            route: '/login'
        });
    }
}
exports.LoginUser = LoginUser;
async function getUsers(req, res, next) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        //  const record = await TodoInstance.findAll({where: {},limit, offset})
        const record = await user_1.UserInstance.findAndCountAll({ limit, offset,
            include: [{
                    model: product_1.ProductInstance,
                    as: 'product'
                }
            ]
        });
        res.status(200).json({
            msg: "You have successfully fetched all users",
            count: record.count - 1,
            record: record.rows,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read",
            route: "/read",
        });
    }
}
exports.getUsers = getUsers;
async function getSingleUser(req, res, next) {
    try {
        const { id } = req.params;
        //   const limit = req.query?.limit as number | undefined;
        //   const offset = req.query?.offset as number | undefined;
        //  const record = await TodoInstance.findAll({where: {},limit, offset})
        const record = await user_1.UserInstance.findOne({ where: { id },
            include: [{
                    model: product_1.ProductInstance,
                    as: 'product',
                    attributes: [
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
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to fetch this user",
            route: "/read",
        });
    }
}
exports.getSingleUser = getSingleUser;
async function getUniqueUserProducts(req, res, next) {
    let id = req.cookies.id;
    try {
        const record = await user_1.UserInstance.findOne({ where: { id },
            include: [{
                    model: product_1.ProductInstance,
                    as: 'product'
                }] });
        const postmanGetUniqueUserProducts = req.headers['postman-token'];
        if (postmanGetUniqueUserProducts) {
            return res.status(200).json({
                record
            });
        }
        res.render("dashboard", { record });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read",
            route: "/read"
        });
    }
}
exports.getUniqueUserProducts = getUniqueUserProducts;
async function redirectToDashboard(req, res, next) {
    let id = req.cookies.id;
    try {
        const record = await user_1.UserInstance.findOne({ where: { id },
            include: [{
                    model: product_1.ProductInstance,
                    as: 'product'
                }] });
        res.redirect("/users/dashboard");
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read",
            route: "/read"
        });
    }
}
exports.redirectToDashboard = redirectToDashboard;
async function logout(req, res) {
    res.clearCookie('token');
    // res.status(200).json({
    //    message: "you have succesfully logged out"
    // })
    res.redirect("/");
}
exports.logout = logout;
