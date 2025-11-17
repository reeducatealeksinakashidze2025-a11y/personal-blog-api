const { isValidObjectId } = require("mongoose")

module.exports = (req, res, next) => {
    console .log("Validating Mongo ID for request:", req.method, req.url);
    const id = req.params.id
    if(!isValidObjectId(id)){
        return res.status(400).json({message: "Wrong Id is provided"})
    }

    next()
}