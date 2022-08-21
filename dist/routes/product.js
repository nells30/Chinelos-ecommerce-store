"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const productController_1 = require("../controller/productController");
router.get('/create', (req, res) => {
    res.render('create');
});
router.post('/create', auth_1.auth, productController_1.Products);
router.get('/:id/edit', async (req, res, next) => {
    let record = await (0, productController_1.getSingleProduct)(req, res, next);
    res.render('edit', { record });
});
router.post('/:id', auth_1.auth, productController_1.updateProduct);
router.get('/read', productController_1.getProducts);
//router.get('/read/:id',getSingleProduct)
router.post('/update/:id', auth_1.auth, productController_1.updateProduct);
router.post('/delete/:id', auth_1.auth, productController_1.deleteProduct);
exports.default = router;
