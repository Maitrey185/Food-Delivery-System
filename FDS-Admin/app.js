if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const ExpressError = require('./utils/ExpressError');
const bodyParser = require("body-parser");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Admin = require('./models/admin');

// importing Routes
const productRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const adminRouters = require('./routes/admin');
const userRoutes = require('./routes/user');

// Connecting Database
const dbUrl = 'mongodb://localhost:27017/fds-admin';

mongoose.connect( dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

// Some middlewaares

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json()) // for parsing application/json
// app.use(bodyParser.json()) // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// session and flash
const sessionConfig = {
    name: 'session',
    secret : 'thisshouldbeabettersecret' ,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

// passport initialization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()));

passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentAdmin = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Routes
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);
app.use('/', adminRouters);
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.render('partials/sidebar')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})