const jwt = require('jsonwebtoken')
const blackListToken = require('../models/blacklist.model')

async function authUser(req,res,next){
    const token = req.cookies.token;

    if(!token){
        res.status(401).json({
            message:"Token Not Provided"
        })
    }

    const isTokenBlackListed = await blackListToken.findOne({token})
    if(isTokenBlackListed){
        res.status(401).json({
            message:"Token is Invalid"
        })
    }

    try{
        const decoded =  jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch(err){
        return res.status(401).json({
            message:"Invalid Token"
        })
    }
}

module.exports = {authUser}