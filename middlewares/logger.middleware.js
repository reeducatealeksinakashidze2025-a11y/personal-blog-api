

exports.logger = (req, res, next) => {
    const time = Date.now()

    res.on('finish', () => {
        const finishTime =  Date.now() - time
        console.log(req.method, req.originalUrl, res.statusCode, `${finishTime}ms`)
    })

    next()
}