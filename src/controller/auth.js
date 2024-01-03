const mongoose = require("mongoose");
const path = require("path");
const response = require("../lib/responseLib");
// const logger = require("../lib/logger-helper");
const { constants, messages } = require("../constants.js");
const jwt = require("jsonwebtoken");
const userModel = require("../model/auth");
const { logger } = require("../logger/logger");
const passwordUtil = require("../utils/password");

const fs = require("fs").promises
const regex = new RegExp(
    /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
);

const mobileRegex = new RegExp(
    /^(0|91)?[6-9][0-9]{9}$/
)

let passwordRegex = new RegExp(
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
);

let registration = async (req, res) => {
    try {
        let ipaddress = req?.headers["HTTPHeaders.ForwardedFor"] ?? req?.socket?.remoteAddress;
        let method = req.method;
        let request_url = `${req?.protocol}://${req.headers.host}${req.originalUrl}`;
        let validUserId = checkmailandmobile(req.body.userId)
        if (validUserId) {
            let isTrue = regex.test(req.body.userId);
            const isUserExist = isTrue
                ? await userModel.findOne({ email: req.body.userId }).lean()
                : await userModel.findOne({ mobile: req.body.userId }).lean();
            if (!isUserExist) {
                let createUser = isTrue
                    ? new userModel({
                        _id: new mongoose.Types.ObjectId(),
                        role: req.body.role ? req.body.role : "User",
                        password: req.body.password,
                        adminName: req.body.adminName,
                        email: req.body.userId
                    })
                    : new userModel({
                        _id: new mongoose.Types.ObjectId(),
                        role: req.body.role ? req.body.role : "User",
                        password: req.body.password,
                        adminName: req.body.adminName,
                        mobile: req.body.userId
                    });
                await createUser.save().then((data) => {
                    // logger.error(`"${method}" request to "${request_url}" for ip address "${ipaddress}" sucess. Response code: "200", Response message: Password must have atleast 8 characters and atmost 16 characters, should contain one uppercase, lowercase, one digit, one special character and should not have whitspaces! username: "${user_name}"!`)
                    let apiResponse = response.generate(constants.SUCCESS, messages.USER.SUCCESS, constants.HTTP_SUCCESS, { _id: data._id })
                    res.status(200).send(apiResponse)
                }).catch((err) => {
                    let apiResponse = response.generate(constants.ERROR, messages.USER.FAILURE, constants.HTTP_BADREQUEST, err);
                    res.status(400).send(apiResponse);
                });
            } else {
                // logger.error(`"${method}" request to "${request_url}" for ip address "${ipaddress}" failed. Response code: "400", Response message: Password must have atleast 8 characters and atmost 16 characters, should contain one uppercase, lowercase, one digit, one special character and should not have whitspaces! username: "${user_name}"!`)
                let apiResponse = response.generate(constants.ERROR, messages.USER.ALREADYEXISTEMAIL, constants.HTTP_BADREQUEST, null);
                res.status(400).send(apiResponse);
            }
        } else {
            let apiResponse = response.generate(constants.ERROR, messages.USER.WRONGUSERNAME, constants.HTTP_BADREQUEST, null);
            res.status(400).send(apiResponse);
        }
    } catch (err) {
        let apiResponse = response.generate(constants.ERROR, messages.USER.FAILURE, constants.HTTP_SERVER_ERROR, err);
        res.status(500).send(apiResponse);
    }
};
let login = async (req, res) => {
    try {
        const { password, userId } = req.body;
        let isTrue = regex.test(userId);
        const getUser = isTrue
            ? await userModel
                .findOne({ email: userId })
                .select("-createdAt -orgName -updatedAt -__v")
            : await userModel
                .findOne({ mobile: userId })
                .select("-createdAt -orgName -updatedAt -__v");
        if (getUser) {
            const resData = {};
            if (getUser && getUser.password && (await getUser.comparePassword(password))) {
                resData.token = passwordUtil.genJwtToken(getUser._id);
                resData.user = (JSON.parse(JSON.stringify({ _id: getUser._id })));
                resData.user.userId = userId;
            } else {
                let apiResponse = response.generate(
                    constants.ERROR,
                    messages.USER.LOGINFAILED,
                    constants.HTTP_UNAUTHORIZED
                );
                res.status(400).send(apiResponse);
                return;
            }
            let apiResponse = response.generate(
                constants.SUCCESS,
                `Welcome ${getUser.adminName}!` /*messages.LOGIN.SUCCESS*/,
                constants.HTTP_SUCCESS,
                resData
            )
            res.status(200).send(apiResponse);
            return;
        } else {
            let apiResponse = response.generate(
                constants.ERROR,
                messages.USER.INVALIDUSER,
                constants.HTTP_NOT_FOUND,
                null
            );
            res.status(400).send(apiResponse);
        }
    } catch (err) {
        let apiResponse = response.generate(
            constants.ERROR,
            messages.USER.LOGINFAILED,
            constants.HTTP_SERVER_ERROR,
            err
        );
        res.status(500).send(apiResponse);
        return;
    }
}
function checkmailandmobile(userId) {
    let isEmailTrue = regex.test(userId);
    let isMobileTrue = mobileRegex.test(userId);
    if (isEmailTrue || isMobileTrue) {
        return true;
    } else {
        return false;
    }
}

module.exports = { registration, login }
// 55637917741 