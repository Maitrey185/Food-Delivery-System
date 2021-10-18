const express = require('express');
const router = express.Router();
const User = require('../models/users');
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync.js');


router.post('/register', catchAsync(async (req, res) => {
    const user = new User(req.body.user);
    await user.save();
    res.send(user);
}))

router.get('/index', isLoggedIn, catchAsync(async (req, res) => {
    const users = await User.find({});
    res.render('user/index', {users});
}))

module.exports = router;