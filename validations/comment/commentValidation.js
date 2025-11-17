const Joi = require('joi');
const mongoose = require('mongoose');

const commentValidationSchema = Joi.object({
    // blog: Joi.string().required().custom((value, helpers) => {
    //     if (!mongoose.Types.ObjectId.isValid(value)) {
    //         return helpers.error("any.invalid");
    //     }
    //     return value;
    // }, "ObjectId validation"),
    // parentComment: Joi.string().allow(null).custom((value, helpers) => {
    //     if (value && !mongoose.Types.ObjectId.isValid(value)) {
    //         return helpers.error("any.invalid");
    //     }
    //     return value;
    // }, "ObjectId validation"),
    
    // author: Joi.string().required().custom((value, helpers) => {
    //     if (!mongoose.Types.ObjectId.isValid(value)) {
    //         return helpers.error("any.invalid");
    //     }
    //     return value;
    // }, "ObjectId validation"),
    // text: Joi.string().min(1).max(1000).required()
      blogId: Joi.string().required().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    }),

    parentCommentId: Joi.string().allow(null).optional().custom((value, helpers) => {
        if (value && !mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    }),

    text: Joi.string().min(1).max(1000).required()
});

module.exports = { commentValidationSchema };
