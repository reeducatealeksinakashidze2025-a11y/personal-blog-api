const { Router } = require("express");
const AuthService = require('./auth.service');
const validateMiddleware = require("../middlewares/validate.middleware");
const { signUpSchema } = require("../validations//auth/sign-up.validation");
const { signInSchema } = require("../validations/auth/sign-in.validation");
const isAuthMiddleware = require("../middlewares/isAuth.middleware");

const authRouter = Router()


authRouter.post('/sign-up', validateMiddleware(signUpSchema), AuthService.signUp)
authRouter.post('/sign-in', validateMiddleware(signInSchema), AuthService.signIn)
authRouter.get('/current-user', isAuthMiddleware, AuthService.currentUser)

module.exports = authRouter