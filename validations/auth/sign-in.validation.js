const Joi = require("joi");


exports.signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(20).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
})

