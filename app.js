const express = require("express");
const session = require("express-session"); 
const flash =  require("express-flash")
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/userModel");
const initializePassport = require("./passport-config")
const methodOverride = require("method-override")

require('dotenv').config(); 

initializePassport(
    passport,
    email => User.findOne({ email }),
    id => User.findOne({ _id: id })
)

const app = express()

//connection to mongodb
mongoose.connect("mongodb://mongodb:27017/todo_express", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// middlewares
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if your app is running over https
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");


// routes
app.use(require("./routes/index"));
app.use(require("./routes/todo"));
app.use(require("./routes/userRoutes"));

// server configurations...
app.listen(3000, () => console.log("Server started listening on port: 3000"));

// user authentication
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.delete('/logout', (req, res) => {
    req.logOut(err => {
        if (err) {
            return next(err);
        }
        res.redirect('/login')
    })
})

// function checkAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next()
//     }
//     res.redirect("/login")
// }

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        res.redirect('/')
    }
    next()
}

