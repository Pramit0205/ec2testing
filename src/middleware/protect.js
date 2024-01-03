const jwt = require('jsonwebtoken');
const UserModel = require('../model/auth');
var ObjectId = require('mongoose').Types.ObjectId;

const catchAsync = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

const regex = new RegExp(
    /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
);
// keep strings in lowercase
const allowedRoutes = ['/api/auth/login', '/api/auth/signup',];

const protect = catchAsync(async (req, res, next) => {
    if (allowedRoutes.includes(req.path.toLowerCase())) return next();

    const authHeader = req.headers.authorization;

    if (!authHeader) return next(new ErrorResponse('Not authorized', 401));

    const token = authHeader.split(' ')[1];

    if (!token) return next(new ErrorResponse('Not authorized', 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) return next(new ErrorResponse('Invalid token', 401));


    const selOpts = {
        profileStatus: 1,
        role: 1,
        username: 1,
        mobile: 1,
        email: 1,
        name: 1,
    };
    let user;
    let isTrue = regex.test(decoded.id);

    if (isTrue) {
        user = await UserModel.findOne({ email: decoded.id }).lean()

    } else if (ObjectId.isValid(decoded.id)) {
        user = await UserModel.findById(decoded.id).lean()
    } else {
        user = await UserModel.findOne({ mobile: decoded.id }).lean()
    }

    if (!user) return next(new ErrorResponse('Invalid token', 401));


    req.user = user;

    next();
});

module.exports = protect;