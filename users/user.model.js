const { number } = require("joi");
const { default: mongoose, Schema } = require("mongoose");


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        require: true
    },
     userName: {
        type: String,
        require: true
    },
    birthDate: {
        type: Date,
        require: false
    },
    gender: {
        type: Number,
        default: false
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        require: true
    },
    password: {
        type: String,
        require: true,
        select: false
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'post',
            default: []
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model('user', userSchema)