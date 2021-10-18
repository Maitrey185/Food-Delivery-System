const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const { isLoggedIn } = require('../middleware');

const Order = require("../models/orders");

router.get('/status', isLoggedIn, catchAsync(async (req, res) => {
    const orders = await Order.find({}).populate('userId').populate({
        path: 'cart',
        populate:{
            path: 'product'
        }
    });
    console.log(Object.keys(orders).length)
    res.render('orders/status2', {orders});
}))

router.get('/dashboard', isLoggedIn, catchAsync(async (req, res) => {
    const orders = await Order.find({}).populate('userId').populate({
        path: 'cart',
        populate:{
            path: 'product'
        }
    });
    res.render('orders/dashboard', { orders })
}))

router.get('/history', isLoggedIn, catchAsync( async (req, res) => {
    const orders = await Order.find({stage : 'history'}).populate('userId').populate({
        path: 'cart',
        populate:{
            path: 'product'
        }
    });
    // console.log(orders);
    // console.log(String(orders[0].orderNo))
    res.render('orders/history', { orders });
}))

router.post('/insert', isLoggedIn,  catchAsync(async (req, res) => {
    const order = new Order(req.body.orders);
    await order.save();
    res.send(order);
}))

router.post('/topreparing/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    const orderStatus = req.body.order.status;
    order.status = orderStatus;
    if(orderStatus === 'accept'){
        order.stage = 'preparing';
    }else{
        order.stage = 'history';
    }
    // console.log(order)
    await order.save();
    res.redirect('/orders/status')
}))

router.post('/dashboard/toprepared/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    order.stage = 'prepared';
    await order.save();
    res.redirect('/orders/dashboard')
}))

router.post('/dashboard/topickedup/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    order.stage = 'pickedup';
    await order.save();
    res.redirect('/orders/dashboard')
}))

router.post('/dashboard/toorderhistory/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    order.stage = 'history';
    await order.save();
    res.redirect('/orders/dashboard')
}))



module.exports = router;