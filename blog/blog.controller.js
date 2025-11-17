const { Router } = require("express");
const isAuthMiddleware = require("../middlewares/isAuth.middleware");
const validateMiddleware = require("../middlewares/validate.middleware");
const { blogValidationSchema } = require("../validations/blog/blogValidator");
const blogService = require("./blog.service");

const blogRouter = Router()
blogRouter.get('/',  blogService.getAllBlog)
blogRouter.get('/my', isAuthMiddleware, blogService.getMyBlogs);
blogRouter.get('/:id',  blogService.getBlogById)
blogRouter.post('/', isAuthMiddleware , validateMiddleware(blogValidationSchema), blogService.createBlog)
blogRouter.patch('/:id', isAuthMiddleware, validateMiddleware(blogValidationSchema), blogService.updateBlog)
blogRouter.delete('/:id', isAuthMiddleware, blogService.deleteBlogById)



module.exports = blogRouter