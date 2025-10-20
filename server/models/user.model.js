const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Fullname is required'],
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique']
    },

    photo: String,

    role: {
        enum: ['user', 'admin', 'moderator'],
        default: 'user',
        type: String
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String
    }
}, { timestamps: true });

// Password hashing

userSchema.pre('save', async function(next){ // pre save კაუჭის გამოყენებით ვუშვებთ ასინქრონულ ფუნქციას სანამ document - ი და - save - დება
    if(!this.isModified('password')) return next(); // ვამოწმებთ შეიცვალა თუ არა მომხმარებლის პაროლი თუ შეიცვლა მაშინ

    this.password = await bcrypt.hash(this.password, 12); // ვაკეთებთ password - ის hashing - ს სხვა შემთხვევაში კი უბრალოდ ვა - save - ებთ

    next(); // თუ ამ middleware ფუნქციის გარდა კიდევ გვაქვს სხვა middleware ფუნქციები გადავალთ შემდეგზე სხვა შემთხვევაში კი document - ს უბრალოდ  დავა - save - ებთ
});

// Comparing Password

userSchema.methods.comparePasswords = async (candidate, password) => { // userShema - ს გააჩნია method - ი სახელად methods ჩვენ ამის გამოყენებით ვქმნით ჩვენივე მეთდს
    // სახელად comparePasswords, ის რებს ორ პარამეტრს candidate, password, candidate - პაროლი რომელიც მოხმარებელმა შემოიტანა, password - პაროლი რომელიც
    // მონაცემთა ბაზაში ინახება
    return await bcrypt.compare(candidate, password); // bcrypt - არის ასინქრონული ეს ნიშნავს იმას რომ მას სჭირდება თავისი დრო
    // აქ ხდება შედარება candidate და password - ის
};

userSchema.methods.createVerificationCode = function(){
    const code = crypto.randomBytes(12).toString('hex');

    this.verificationCode = code;

    return code;
};

const User = mongoose.model("Users", userSchema);

module.exports = User;