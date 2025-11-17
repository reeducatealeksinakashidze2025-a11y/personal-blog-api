const { Router } = require("express");
const isAuthMiddleware = require("../middlewares/isAuth.middleware");
const validateMiddleware = require("../middlewares/validate.middleware");
const commentService = require("./comment.service");
const { commentValidationSchema } = require("../validations/comment/commentValidation");

const commentRouter = Router()
commentRouter.get("/blog/:blogId",   commentService.getCommentsByBlogId);
commentRouter.post("/", isAuthMiddleware, validateMiddleware(commentValidationSchema), commentService.createComment);
commentRouter.delete("/:id", isAuthMiddleware, commentService.deleteCommentById);
module.exports = commentRouter