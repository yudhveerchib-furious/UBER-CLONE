import userModel from "../models/user.model.js";
import Blacklist from "../models/blacklist.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const authUser = async(req,res,next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({
            message: "unauthroized!"
        })
    }
    const isBlackListed = await Blacklist.findOne({ token: token})
    if(isBlackListed){
        return res.status(401).json({
            message: "unauthorized!"
        })
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await userModel.findById(decoded._id)
        req.user = user
        return next()
    } catch (error) {
        return res.status(401).json({
            message: 'unauthorized!'
        })
    }
}

export default authUser;