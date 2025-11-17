const { default: mongoose } = require("mongoose")
require('dotenv').config()

module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Connected successfully')
    } catch (error) {
        console.log('Cound not connected to DB', error)
    }   
}
