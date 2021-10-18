const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });
const { isLoggedIn } = require('../middleware');

const Product = require("../models/product");

router.get('/', isLoggedIn,  catchAsync(async (req, res) => {
    const products = await Product.find({});
    console.log(req.user.username.toUpperCase())
    res.render('products/index', { products })
}))

router.post('/', isLoggedIn, upload.single('image'), catchAsync(async (req, res, next) => {
    const product = new Product(req.body.product);
    product.image = { url : req.file.path, filename: req.file.filename};
    await product.save();
    req.flash('success', 'Successfully added!')
    res.redirect('/products')
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('products/new')
})

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if( !product){
        req.flash('error', 'Can not find the food item!')
    }
    res.render('products/edit', {product})
}))

router.put('/:id', isLoggedIn, upload.single('image'), catchAsync(async (req, res) => {
    // console.log(req.body.product, req.file);
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, {...req.body.product});
    if( req.file ){
        product.image = { url : req.file.path, filename: req.file.filename};
        await product.save();
    }
    req.flash('success', 'Successfully edited!')
    res.redirect('/products')

}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted!')
    res.redirect('/products');
}))

module.exports = router;