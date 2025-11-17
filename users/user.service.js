const userModel = require("./user.model")
const responseBase = require("../utils/response-base");
exports.getAllUsers = async (req, res) => {
    const queryParams = req.query || {}
    const filter = {}

    // if ('isSmoker' in queryParams) {
    //     filter['isSmoker'] = Number(queryParams.isSmoker) ? true : false
    // }

    if ('email' in queryParams) {
        filter['email'] = {
            '$regex': `^${queryParams.email}`
        }
    }

    // if ('ageFrom' in queryParams) {
    //     filter['age'] = {
    //         ...filter['age'],
    //         '$gte': Number(queryParams.ageFrom)
    //     }
    // }

    // if ('ageTo' in queryParams) {
    //     filter['age'] = {
    //         ...filter['age'],
    //         '$lte': Number(queryParams.ageTo)
    //     }
    // }

    const users = await userModel.find(filter).populate('posts', 'title content')
    res.json(responseBase.success(users))
}


exports.createUser = async (req, res) => {
    const {fullName, userName, birthDate, gender, email, password } = req.body
   
       const existUser = await userModel.findOne({ email })
       if (existUser) {
           return res.status(400).json(responseBase.fail("user already exists"))
       }
   
       const hashedPassword = await bcrypt.hash(password, 10)
       await userModel.create({
           fullName,
           userName,
           birthDate,
           gender,
           email,
           password: hashedPassword
       })
    res.status(201).json(responseBase.success(newUser,"user created successfully"))
}


exports.getUserById = async (req, res) => {
    const id = req.params.id
    const user = await userModel.findById(id)
    if (!user) {
        return res.status(404).json(responseBase.fail("user not found"))
    }
    res.json(responseBase.success(user))
}

exports.deleteUserById = async (req, res) => {
    const id = req.params.id
    const deletedUser = await userModel.findByIdAndDelete(id)
    if (!deletedUser) {
        return res.status(404).json(responseBase.fail("user not found"))
    }
    res.json(responseBase.success(deletedUser))
}

exports.updateUserById = async (req, res) => {
    const id = req.params.id
    const updateReq = {
        name: req.body.name,
        email: req.body.email
    }
    const updatedUser = await userModel.findByIdAndUpdate(id, updateReq, { new: true })
    if (!updatedUser) {
        return res.status(404).json(responseBase.fail("user not found"))
    }
    res.json(responseBase.success(updatedUser))
}