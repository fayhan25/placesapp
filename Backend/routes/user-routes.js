const express = require("express");
const userController = require("../controllers/user-controllers");
const router = express.Router();
const {check} = require("express-validator");
const fileUpload = require('../middleware/file-upload');
router.get("/", userController.getAllUsers);

router.post(
    '/signup', 
    fileUpload.single('image'),
    [check('email').normalizeEmail().isEmail(),
    check('password').exists().isLength({min:5}),
    check('name').exists()
    ],
    userController.signup
)

router.post(
    '/login', 
    [check('email').normalizeEmail().isEmail(),
    check('password').exists()
    ],        
    userController.login
    );

module.exports = router;