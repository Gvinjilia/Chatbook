const User = require("../models/user.model");
const AppError = require("../utils/appError");
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if(!token){
            return next(new AppError('You are not authorized!', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return next(new AppError('Invalid token!', 401));
        }

        const user = await User.findById(decoded.id);

        if(!user){
            return next(new AppError('User does not exist', 404));
        }


        req.user = user;

        next();
    } catch(err){
        if (err.name === "TokenExpiredError") {
            return next(new AppError('your authorization time has expired!', 400));
        }

        return next(new AppError("you are not authorized!", 401));
    }
};

const allowedTo = (...roles) => { // ვქმნით ფუნქციას რომელიც გადაცემულ roles - ებს მოაქცევს მასივში
    return (req, res, next) => { // ვაბრუნებთ ფუნქციას, გადაეცემა სამი არგუმენტი req, res და next middleware ფუნქცია
        if(!roles.includes(req.user.role)){ // ვამოწმებთ თუ როლების მასივი არ შეიცავს მომხმარებლის როლს რომელმაც გაიარა აუთენტიკაცია
            return next(new AppError('You do not have permission!', 401)); // მაშინ ვუბრუნებთ error - ს You do not have a permission 401 status კოდით
        }

        next(); // თუ if - ში არსებული პირობა არ დაკმაყოფილდა მაშინ გადავდივართ შემდეგ ფუნქციაზე მაგალითად getPost
    }
};

// role - ების კონტროლი გვჭირდება იმისათვის რომ არ მივცეთ ჩვეულებრივ მომხმარებელს იმ route - ებზე და რესურსებზე წვდომა რომელიც მხოლოდ
// admin, moderator - ისთვის არის დაშვებული

module.exports = { protect, allowedTo };