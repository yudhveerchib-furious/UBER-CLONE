import {
 createCaptain
} from "../services/captain.service.js" 
import { validationResult } from "express-validator"
import { captainModel } from "../models/captain.model.js"
import  Blacklist  from '../models/blacklist.model.js';

export const registerCaptain = async(req,res,next) => {
     const errors = validationResult(req)
     if(!errors.isEmpty()){
       return res.status(400).json({
         errors: errors.array()
       })
     }
   const { fullname, email, password, vehicle } = req.body;
const isExist = await captainModel.findOne({email});

if(isExist){
    return res.status(400).json({
        message:"already exists"
    })
}

const hashedPassword = await captainModel.hashPassword(password);

const captain = await captainService.createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType
});

   const token = captain.generateAuthToken()
   res.status(201).json({token,captain})
} 

export const loginCaptain = async(req,res,next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
     const {email,password}= req.body
   const captain = await captainModel.findOne({email}).select('+password')

   
    if(!captain){
        return res.status(401).json({
            message:"invalid email or password!"
        })
    }
    const isMatch = await captain.comparePassword(password);
    if(!isMatch){
         return res.status(401).json({
            message:"invalid email or password!"
        })
    }
const token = captain.generateAuthToken()
res.cookie('token',token)

res.status(200).json({token,captain})
}
export const getCaptainProfile = async(req,res,next) => {
       res.status(200).json({captain: req.captain})
}

export const logOutCaptain = async(req,res) => {
    res.clearCookie('token')

    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]
    await Blacklist.create({ token })

    res.status(200).json({
        message: "Logged out successfully"
    });
} 