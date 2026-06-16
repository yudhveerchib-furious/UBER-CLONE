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