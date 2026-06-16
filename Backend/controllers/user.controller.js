import Blacklist from "../models/blacklist.model.js";
import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import {validationResult} from 'express-validator'


export const registerUser = async(req,res,next) => {
   const errors = validationResult(req);
if (!errors.isEmpty()) {
    return res.status(400).json({
        errors: errors.array()
    });
}

   const { fullname, email, password } = req.body;
   const { firstname, lastname } = fullname || {};

   const hashPassword = await userModel.hashPassword(password)
   
   const user = await userService.createUser({
    firstname,
    lastname,
    email,
    password: hashPassword
});
   const token = user.generateAuthToken();

   res.status(201).json({
    token,user
   })

}

export const loginUser = async(req,res,next)=>{
     const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
        errors: errors.array()
    });
  }
  const {email,password} = req.body;
  const user = await userModel.findOne({email}).select('+password')
  if(!user){
    return res.status(401).json({
        message: "Invalid email or password"
    })
  }  
  const isMatch = await user.comparePasword(password);

  if(!isMatch){
    return res.status(401).json({
        message: "Invalid email or password"
    })
  }
  const token = user.generateAuthToken();
  res.cookie('token', token);
  res.status(200).json({token,user})
  
}


export const getUserProfile = async(req,res,next) => {
       res.status(200).json(req.user)
}

export const logOut = async(req,res) => {
    res.clearCookie('token')

    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]
    await Blacklist.create({ token })

    res.status(200).json({
        message: "Logged out successfully"
    });
} 