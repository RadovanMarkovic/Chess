const {Router} = require("express");
const {register, login} = require("../../controllers/api/user");
const { check } = require("express-validator");

const router = Router();

router.post("/register", [
    check('username', "Username is required").notEmpty(),
    check('email', "Email is required").notEmpty(),
    check('email', "Please enter a valid email").isEmail(),
    check('password', "Password is required").notEmpty(),
    check('confirmPassword', "Please confirm your password").notEmpty()
], register)

router.post("/login", [
    check('email', "Email is required").notEmpty(),
    check('email', "Please enter a valid email").isEmail(),
    check('password', "Password is required").notEmpty()
], login)


module.exports= router;

