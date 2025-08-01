const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const userController = require("../controller/users.js");

router
.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router
.route("/login")
.get(userController.renderLoginForm)
.post(saveredirectUrl, passport.authenticate("local", { failureRedirect : `/login`, failureFlash : true }),userController.authenticateUser);

router.get("/logout",userController.logout);

module.exports = router;