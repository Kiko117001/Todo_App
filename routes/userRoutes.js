const router = require("express").Router();
const passport = require("passport");
const User = require("../models/userModel");

// Register Logic
router.get("/register", checkNotAuthenticated, async(req, res) => {
    res.render('register');
})

router.post("/sign-up", checkNotAuthenticated, async (req, res) => {
    const { email, password } = req.body;
    let userExists = await User.findOne({ email });

    if (userExists) {
        res.status(401).json({ message: "Email is already in use."});
        return;
    }

    let user = new User({
        email,
        password,
    });

    user.save().then(() => {
        res.render("login.ejs");
    }).catch((error) => {
        res.status(500).json({ message: "Internal server error" }); 
    });
});


// Login Logic
router.get("/login", checkNotAuthenticated, async(req, res) => {
    res.render("login");
});

//router.post("/login", passport.authenticate('local'))

router.get("/logout", (req, res) => {
    req.logout();
    res.json({ message: "Logout successful" });
 });

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()){
      return res.redirect('/')
  }
  next()
}

module.exports = router;