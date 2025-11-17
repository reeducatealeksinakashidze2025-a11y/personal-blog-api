const userModel = require("../users/user.model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const responseBase = require("../utils/response-base");



exports.signUp = async (req, res) => {
    const {fullName, userName, birthDate, gender, email, password } = req.body

    const existUser = await userModel.findOne({ email })
    if (existUser) {
        return res.status(400).json(responseBase.fail("user already exists" ))
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await userModel.create({
        fullName,
        userName,
        birthDate,
        gender,
        email,
        password: hashedPassword
    })
    res.json(responseBase.success("user created successfully"))
}


exports.signIn = async (req, res) => {
    const { email, password } = req.body

    const existUser = await userModel.findOne({ email }).select('password')
    if (!existUser) {
        return res.status(400).json(responseBase.fail("email or password is incorrect" ))
    }

    const isPassEqual = await bcrypt.compare(password, existUser.password)
    if (!isPassEqual) {
        return res.status(400).json(responseBase.fail("email or password is incorrect" ))
    }

    const payload = {
        userId: existUser._id,
    }

    const token = await jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'})
    res.json(responseBase.success(token))
}


exports.currentUser = async (req, res) => {
    const user = await userModel.findById(req.userId)
    res.json(responseBase.success(user))
}