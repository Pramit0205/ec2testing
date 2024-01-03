const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const passwordUtil = require('../utils/password');

const userSchema = mongoose.Schema({
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'User',
        enum: ['Admin', 'User']
    },
    adminName: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
    },
    email: {
        type: String,
    },
}, {
    timestamps: { createdAt: true, updatedAt: true }, Strict: false
}
);
userSchema.pre('save', async function (next) {
    if (this.isModified('password') && this.password) {
        this.password = await passwordUtil.getHash(this.password);
    }
    next();
});

// compare password
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};
const User = mongoose.model('User', userSchema);

module.exports = User;
