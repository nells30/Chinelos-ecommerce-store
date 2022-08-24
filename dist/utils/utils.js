"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.generateToken = exports.loginSchema = exports.registerSchema = exports.updateProductSchema = exports.createTodoSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.createTodoSchema = joi_1.default.object().keys({
    // title:Joi.string().lowercase().required(),
    // completed:Joi.boolean().required(),
    name: joi_1.default.string().lowercase().required(),
    image: joi_1.default.string().lowercase().required(),
    brand: joi_1.default.string().lowercase().required(),
    category: joi_1.default.string().lowercase().required(),
    description: joi_1.default.string().lowercase().required(),
    price: joi_1.default.number().required(),
    countInStock: joi_1.default.number().required(),
    rating: joi_1.default.number().required(),
    numReviews: joi_1.default.number().required(),
});
exports.updateProductSchema = joi_1.default.object().keys({
    name: joi_1.default.string(),
    image: joi_1.default.string(),
    brand: joi_1.default.string(),
    category: joi_1.default.string(),
    description: joi_1.default.string(),
    price: joi_1.default.number(),
    countInStock: joi_1.default.number(),
    rating: joi_1.default.number(),
    numReviews: joi_1.default.number()
});
exports.registerSchema = joi_1.default.object().keys({
    fullname: joi_1.default.string().required(),
    email: joi_1.default.string().trim().lowercase().required(),
    gender: joi_1.default.string().required(),
    phone: joi_1.default.string().length(11).pattern(/^[0-9]+$/).required(),
    address: joi_1.default.string().required(),
    password: joi_1.default.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    confirm_password: joi_1.default.ref("password")
}).with('password', 'confirm_password');
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string().regex(/^[a-zA-Z0-9]{3,30}$/),
});
//Generate Token
const generateToken = (user) => {
    const pass = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign(user, pass, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
exports.options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
};
