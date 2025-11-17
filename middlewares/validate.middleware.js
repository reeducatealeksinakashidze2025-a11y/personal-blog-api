

module.exports = (schema) => (req, res, next) => {
     console.log("INCOMING:", req.method, req.url);
    const { error, value } = schema.validate(req.body || {}, { abortEarly: false })
    if (error) {
        return res.status(400).json({
            message: error.details.map(el => el.message)
        })
    }

    req.body = value
    next()
} 