const User = require("../models/user.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken');
const sendEmail = require("../utils/email");

// 1. პაროლი არ არის ენკრიპტირებული, ეს ნიშნავს იმას რომ ყველას შეეძლება პაროლის წაკითხვა
// 2. მომხმარებლი შეიძლება დარეგისტრირდეს არასწორი ან არარსებული email - ით ანუ არ ხდება ამ ყველაფრის შემოწმება
// 3. არ ვიყენებთ JWT token - ს მაგრამ კარგი პრაქტიკაა რადგან მომხმარებელს აღარ უწევს ხელახლა თავიდან თავისი ინფორმაციის შემოტანა


// sign out token called token that has user info such as role and id

const signToken = (user) => {
    return jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
};

// createSendToken we use this controller to create a token with the settings and also we store this created token in cookie session 

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user);
    
    res.cookie("token", token, {
        maxAge: process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "dev" ? false : true,
        httpOnly: true,
        sameSite: "Lax"
    });

    // 4) ვაბრუნებთ მოხმარებლის მონაცემებს და JWT Token
    res.status(statusCode).json({
        status: "success",
        data: {
            user
        }
    });
}

// signup function

const signup = catchAsync(async (req, res) => { // ვქმნით ფუნქციას signup catchAsync - ის დახმარებით დავიჭერთ ყველა ასინქრონულ error - ს
    const { fullname, email, password } = req.body; // ვიღებთ fullname, email, password - კუთვნილებებს req.body - დან

    const newUser = await User.create({ // მონაცემთა ბაზაში ვქმნით გადმოცემული მონაცემებით მომხმარებელს
        fullname,
        email,
        password
    });

    const code = newUser.createVerificationCode();

    await newUser.save({ validateBeforeSave: false });

    const url = `${req.protocol}://${req.get("host")}/api/auth/verify/${code}`

    sendEmail(email, 'Hello from Chatbook', `
            <div style="display: flex; margin-left: 50px; flex-direction: column; gap: 5px">
                <h2 style="font-family: 'Brush Script MT', cursive;">Chatbook</h2>
                <h1 style="font-family: Arial, sans-serif;">Welcome to <br /> Chatbook! 🎉</h1>
                <p style="font-family: Arial, sans-serif; font-size: 14px">Your space to connect, share, and be yourself. <br /> Whether you're posting updates or chatting with friends, <br /> Chatbook is where conversations come to life</p>
                <p style="font-family: Arial, sans-serif; font-size: 14px">Click the button bellow to verify email</p>
                <button style="background-color: #8B3DFF; border: none; padding: 10px; width: 100px; border-radius: 5px"><a href='${url}' 
                style="text-decoration: none; color: white">Verify Email</a></button>
            </div>
        `);

    res.status(201).json({ // ვაბრუნებთ პასუხს
        status: 'success', // status - ით success
        message: 'User created successfully' // message User created successfully
    });
});

// verify email controller

const verifyEmail = catchAsync(async (req, res, next) => {
    const { code } = req.params;

    const user = await User.findOne({ verificationCode: code });

    if(!user){
        return next(new AppError('The code is incorrect'));
    }

    user.isVerified = true,
    user.verificationCode = undefined;

    await user.save()

    res.status(200).send('<h1>User verified</h1>');
});


// login function

const login = catchAsync(async (req, res, next) => { // ვქმნით ფუნქციას სახელად login - რომელიც არის ასინქრონული თუ რაიმე error - ი დაფიქსირდა დავიჭერთ
    // catchAsync - ით
    const { email, password } = req.body; // ვიღებთ email, password - კუთვნილებებს req.body - დან

    const user = await User.findOne({ email }).select('+password'); // გადმოცემული email - ით ვპოულობთ მომხმარებელს მონაცემთა ბაზაში, select('+password')
    // ამ კოდის დახმარებით ჩვენ შეგვიძლია password - ის ნახვა, ამას ჩვენ ვიყენებთ პაროლების შედარებისთვის

    if(!user){ // თუ ვერ მოიძებნა მომხმარებელი გადმოცემული email - ით
        return next(new AppError('email or password is incorrect', 404)); // next middleware - ვიძახებთ და გადავცემთ AppError ს გადავცემთ მნიშვნელობებს
        // პირველი არის message - ი, email or password is incorrect და status code 404
    }

    const isCorrect = await user.comparePasswords(password, user.password); // აქ უკვე ვიყენებთ ჩვენს მიერ შექმნილ method - ს გადავცემთ პაროლს რომელიც
    // მომხმარებელმა შემოიტანა და პაროლს რომელიც მონაცემთა ბაზაში ინახება

    if(!isCorrect){ // თუ პაროლები ერთმანეთს არ დაემთხვა ვაგზავნით იგივე error - ს
        return next(new AppError('email or password is incorrect', 404)); // message - ად email or password is incorrect, status code - ად 404 - ს
    }

    user.password = undefined; // მომხმარებლის პაროლს ვუტოლებთ undefind რადგან არ დაგვიბრუნდეს პასუხად

    createSendToken(user, 200, res);
    
    // token - ს გადაეცემა სამი არგუმენტი, payload - ეს ნიშნავს მომხმარებლის ინფორმაციას როგორიცაა id, role. JWT_SECRET - გასაღები, და დრო თუ როდის ამოიწურება ის
    // sign - იგივე ხელმოწერა ამის დახმარებით ჩვენ ჩვენს token - ს ვხდით უსაფრთოხოს ანუ არავის არ შეეძლება არსებული მონაცემების წაკითხვა

    // cookie - ს გააჩნია რამოდენიმე options
    // name - cookie - ს სახელი
    // value - მნიშვნელობა რომელიც გვინდა რომ შევინახოთ cookie - ში
    // maxAge - როდის ამოიწურება cookie - ს დრო
    // secure - თუ მნიშვნელობა არის  true - მაშინ cookie - ი გაიგზავნება მხოლოდ https - ის დახმარებით
    // httpOnly - true - ს ვიყენებთ მაშინ როდესაც არ გვინდა რომ cookie იყოს Javascript - ისთვის ხელმისაწვდომი

    // sameSite - ამით ჩვენ ვაკონტროლებთ თუ როდის უნდა გაიგზავოს cookie, თუ მნიშვნელობა არის strict - ი მაშინ ჩვენი cookie - ი გაიგზავნება მაშინ
    // როდესაც მომხმარბელი შევა საიტზე
    // Lax - cookie - გაიგზავნება GET მოთხოვნებზე 
    // None - ის დროს cookie - ს ვაგზავნით ნებისმიერ შემთხვევაში მაგრამ https - ით  

    // path - ვაგზავნით cookie - ს გადმოცემულ მისამართზე
    // domain - ვაგზავნით cookie - ს გადმოცემულ დომეინზე

    res.status(201).json({ // ვაბრუნებთ მომხმარებლის მონაცემებს (password - ის გარეშე) იმ შემთხვევაში თუ პაროლები ერთმანეთს დაემთხვა
        status: 'success',
        data: {
            user
        }
    });
});

// get users controller

const getUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json(users)
});

// auto login for the people who do not want to use the same information over and over again during login

const autoLogin = (req, res) => {
    const user = req.user;

    res.status(201).json(user);
};

// logout - რომ გამოვიდეთ account - იდან

const logout = (req, res) => {
    res.clearCookie('token', {
        maxAge: process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "dev" ? false : true,
        httpOnly: true,
        sameSite: "Lax"
    });

    res.status(200).json('logged out successfully');   
};


// JWT - JSON WEB TOKEN - არის უფრო დაცული გზა რითიც ჩვენ შეგვიძლია გავაგზავნოთ ინფორმაცია კლიენტსა და სერვერს შორის

module.exports = { signup, login, verifyEmail, getUsers, autoLogin, logout };