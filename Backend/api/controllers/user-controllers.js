const HttpError = require("../models/http-errors");
const User = require('../models/users');
const {validationResult, check} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllUsers = async(req,res,next) => {
    let users;
    try{
        users= await User.find({},'-password');
    }
    catch(err){
        return next(new HttpError("failed to fetch users",500));
    }

    res.json({users: users.map(user => user.toObject({getters:true}))});
}

const signup = async (req,res,next) => {
    const error = validationResult(req);
    if (!error.isEmpty()){
        return next( new HttpError("Your email,password, or name is invalid please try again",422));
    }
    const {name, email, password} = req.body;

    let existingUser;
    
    try{
        existingUser = await User.findOne({email:email});
    }
    catch(err){
        const error = new HttpError("Signing up failed",500);
        return next(error);
    }

    if (existingUser){
        const error = new HttpError("Signing up failed user already exists",422);
        return next(error);
    }

    let hashedPassword;

    try {hashedPassword = await bcrypt.hash(password,12)}
    catch(err){
        return next(new HttpError("please try again problem hashing the password",500));
    }
    const newUser = new User({
        name : name,
        email : email,
        password: hashedPassword,
        image: req.file.path.replace("\\", "/"),
        places:[]
    });

    try{
        await newUser.save();
    }
    catch(err){
        const error = new HttpError("Signing up failed could not save ",500);
        return next(error);
    }

    let token;

    try{
        token = jwt.sign(
            {userId : newUser.id, email: newUser.email},
            'super_secret_dont_share',
            {expiresIn: '1h'}
            );

        }
    catch(err){
        return next(new HttpError('Problem with token try again'),500);
    }
    res.status(201).json({userId: newUser.id, email: newUser.email, token: token});
}

    


const login = async (req,res,next) => {
    const error = validationResult(req);
    if (!error.isEmpty()){
        return next (new HttpError("A user with these credential does not exist",422));
    }
    const {email,password} = req.body;
    let checkLogin;
    try{
        checkLogin = await User.findOne({email :email})
    }
    catch(err){
        const error = new HttpError("problem logging in",500);
        return next(error);
    }

    if (!checkLogin){
        const error = new HttpError("No such user exists try again",500);
        return next(error);
    }
    let isValidPassword = false;

    try {isValidPassword = await bcrypt.compare(password,checkLogin.password)}
    catch(err){
        return next(new HttpError("please try again problem hashing the password",500));
    }

    if (!isValidPassword){
        const error = new HttpError("No such user exists try again",500);
        return next(error);
    }

    let token;
    try{
        token = jwt.sign(
            {userId : checkLogin.id, email: checkLogin.email},
            'super_secret_dont_share',
            {expiresIn: '1h'}
            );

        }
    catch(err){
        return next(new HttpError('Problem with token try again'),500);
    }


    res.json({userId: checkLogin.id, email: checkLogin.email, token:token});
}

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login= login;