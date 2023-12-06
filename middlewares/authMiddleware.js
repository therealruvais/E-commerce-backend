const User = require('../models/userModel')
const jwt = require('jsonwebtoken')


const authMiddleware = async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req?.headers?.authorization?.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            let user = await User.findById(decoded?.id)
            req.user = user;
            next()
        } catch (error) {
            throw new Error('token expired')
        }
    } else {
        throw new Error('there is no token attached to the header')
    }
}

const isAdmin = async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if (adminUser.role !== "admin") {
        throw new Error('you are not an admin')
    } else {
        next()
    }
}

module.exports = { authMiddleware, isAdmin };