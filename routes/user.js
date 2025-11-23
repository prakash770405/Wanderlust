const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({
            email,
            username
        })
        const registeruser = await User.register(newuser, password);
        req.login(registeruser, (err) => {  // if user signup than directly forward to login listing
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        })
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login",
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    wrapAsync(async (req, res) => {
        req.flash("success", "Welcome back to Wanderlust !!");
        res.redirect("/listings");
    }));

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You Logout Successfully");
        res.redirect("/listings");
    })

})


module.exports = router;