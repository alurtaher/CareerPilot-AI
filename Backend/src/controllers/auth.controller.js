const userModel = require('../models/user.model')
const blackListModel = require('../models/blacklist.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * @route registerUserController
 * @description Register a new User,expects a username,email,password in the request body
 * @access public
 */
async function registerUserController(req,res){
    const {username,email,password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            message:"Please provide username,email,password"
        })
    }

    const isUserAlreadyExisted = await userModel.findOne({
        $or:[{username},{email}]
    })

    if(isUserAlreadyExisted){
        return res.status(400).json({
            message:"Account already exists with this username or email"
        })
    }

    const hash = await bcrypt.hash(password,5)

    const user = await userModel.create({
        username,
        email,
        password:hash
    })

    const token = jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    res.cookie("token",token)

    return res.status(201).json({
        message:"User registered Successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

/**
 * @route loginUserController
 * @description Login a new User,expects a email,password in the request body
 * @access public
 */
async function loginUserController(req,res){
    const {email,password} = req.body;
    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message:"Invalid User or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message:"password doesn't match"
        })
    }

    const token = jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token)

    return res.status(200).json({
        message:"User Login Successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

/**
 * @route logoutUserController
 * @description Clear token from Cookie and add the user in blacklist
 * @access public
 */
async function logoutUserController(req,res){
    const token = req.cookies.token;

    if(token){
        await blackListModel.create({token})
    }
    res.clearCookie("token")

    res.status(200).json({
        message:"User Logged Out successfully"
    })
}

/**
 * @route getMeController
 * @description Get the current Login User Details
 * @access private
 */
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.status(200).json({
        message: "User details fetched successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

module.exports = {registerUserController,loginUserController,logoutUserController,getMeController}