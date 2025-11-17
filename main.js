
const express = require('express')
const userRouter = require('./users/user.controller')
const authRouter = require('./auth/auth.controller')
const blogRouter = require('./blog/blog.controller')
const commentRouter = require('./comment/comment.controller')
const connectToDB = require('./config/db.config')
const { logger } = require('./middlewares/logger.middleware')
const cors = require('cors') 
const app = express()


app.use(express.json())
app.use(cors());
app.use(logger)
app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/blog', blogRouter)
app.use('/comment', commentRouter)


connectToDB().then(() => {
    app.listen(3000, () => {
        console.log('server running on http://localhost:3000')
    })
})

