const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

// Patterns
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const generateRandomToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

const userSchema = new Schema({
    name: {
        required: true,
        type: String,
        minlength: [3, 'Name must have at least 3 chars!'],
        trim: true
    },
    lastName: {
        // required: true,
        type: String,
        minlength: [6, 'Last Name must have at least 8 chars!'],
        trim: true
    },
    nickName: {
        required: true,
        type: String,
        minlength: [3, 'Nickname must have at least 3 chars!'],
        unique: true,
        trim: true
    },
    email: {
        required: true,
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        match: [EMAIL_PATTERN, 'Format of email is invalid']
    },
    password: {
        required: true,
        type: String
    },
    avatar: {
        type: String,
        default: 'https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwim4caXiZ_mAhXFyIUKHdgvCkYQjRx6BAgBEAQ&url=https%3A%2F%2Fdocs.atlassian.com%2Faui%2F8.1.0%2Fdocs%2Favatars.html&psig=AOvVaw3L5I5auDpmDiOP-dlWQZSh&ust=1575654664635256'
    },
    validated: {
        type: Boolean,
        default: false
    },
    userToken: {
        type: String,
        default: generateRandomToken
    },
    socialLog: {
        type: Object
    },
    rol: {
        type: String,
        enum: ['Admin', 'Moderator', 'User'],
        default: 'User'
    },
    banned: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true    
})

userSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(SALT_WORK_FACTOR)
            .then(salt => {
                return bcrypt.hash(user.password, salt)
                    .then(hash => {
                        user.password = hash;
                        next();
                    });
            })
            .catch(error => next(error));
    } else {
        next();
    }
});


userSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
}


const User = mongoose.model('User', userSchema)

module.exports = User