const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        maxLength: [30, 'The name cannot exceed more than 30 characters'],
        minLength: [4, 'The name should have more than 5 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        validate: [validator.isEmail, 'Please provide valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please provide your password'],
        minLength: [6, 'The password should have more than 6 characters'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRE
    })
}

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model('User', userSchema);