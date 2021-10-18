const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

const Admin = require('../models/admin');


router.get('/register', (req, res) => {
    res.render('admin/register');
})

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const admin = new Admin({ email, username });
        const registerAdmin = await Admin.register(admin, password);
        req.login(registerAdmin, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome!');
            res.redirect('/products');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('admin/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectTo = '/products';
    res.redirect(redirectTo);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye');
    res.redirect('/login');
})


module.exports = router;