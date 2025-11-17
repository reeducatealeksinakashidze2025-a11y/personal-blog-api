const { Router } = require("express");
const UsersService = require('./user.service');
const isValidMongoIdMiddleware = require("../middlewares/isValidMongoId.middleware");
const validateMiddleware = require("../middlewares/validate.middleware");
const { signUpSchema } = require("../validations/auth/sign-up.validation");

const userRouter = Router()

userRouter.get('/', UsersService.getAllUsers)
userRouter.get('/:id', isValidMongoIdMiddleware, UsersService.getUserById)
userRouter.post('/', validateMiddleware(signUpSchema),UsersService.createUser)
userRouter.delete('/:id', isValidMongoIdMiddleware, UsersService.deleteUserById)
userRouter.patch('/:id', isValidMongoIdMiddleware, UsersService.updateUserById)

module.exports = userRouter