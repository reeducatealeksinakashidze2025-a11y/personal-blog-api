const Joi = require("joi");
const mongoose = require("mongoose");

const blogValidationSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .required()
    .messages({
      "string.empty": "სათაური აუცილებელია",
      "string.min": "სათაური უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს",
    }),

  coverImageUrl: Joi.string()
    .uri()
    .required()
    .messages({
      "string.uri": "სურათის ბმული უნდა იყოს სწორი URL ფორმატში",
      "any.required": "სურათის ბმული აუცილებელია",
    }),

  contentHtml: Joi.string()
    .min(10)
    .required()
    .messages({
      "string.empty": "შიგთავსი აუცილებელია",
      "string.min": "შიგთავსი ძალიან მოკლეა",
    }),

  // author: Joi.string()
  //   .custom((value, helpers) => {
  //     if (!mongoose.Types.ObjectId.isValid(value)) {
  //       return helpers.error("any.invalid");
  //     }
  //     return value;
  //   })
  //   .required()
  //   .messages({
  //     "any.invalid": "ავტორის ID არასწორია",
  //     "any.required": "ავტორის ID აუცილებელია",
  //   }),
}).unknown(true);

module.exports = { blogValidationSchema };