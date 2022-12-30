const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

exports.registerUser = catchAsyncErrors(async(req, res, next) => {
    const { name, email, password} = req.body;

    const user = await User.create({
        name, 
        email, 
        password,
        avatar: {
            public_id: 'this is a sample id',
            url: 'profilepicurl'
        }
    });

    sendToken(user, 201, res);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return next(new ErrorHandler('Please provide username and password', 400));
    }

    const user = await User.findOne({email}).select('+password');

    if(!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res);
});

exports.logout = catchAsyncErrors(async (req, res, next) => {

    res.cookie('token', null, {
        expires:new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged Out'
    })
});

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({email: req.body.email});

    if(!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your Password Reset Token is :- \n\n ${resetPasswordUrl}`;

    try {

        await sendEmail({
            email: user.email,
            subject: 'EShop Password Recovery',
            message
        }); 

        res.status(200).json({
            success: true,
            message: `Email send to ${user.email} successfully`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message, 500));
    }

});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken
    });

    if(!user) {
        return next(new ErrorHandler('User not found', 401));
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password doesnot password', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    sendToken(user, 200, res);
});

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {

    const user = await User.find(req.user._id);

    res.status(200).json({
        success: true,
        user
    });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.find(req.user._id).select('+password');

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched) {
        return next(new ErrorHandler('Old Password is incorrect', 400));
    }

    if(req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password doesnot matched!', 400));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
});

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    })
});

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });
});

exports.getSingleUsers = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler('User doesnot exists', 404));
    }

    res.status(200).json({
        success: true,
        user
    });
});

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    })
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler('User doesnot exists', 404));
    }

    await user.remove();

    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    })
});
