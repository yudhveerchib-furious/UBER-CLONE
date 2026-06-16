import express from 'express'
import {body} from 'express-validator'
import {registerUser,loginUser} from '../controllers/user.controller.js'

const router = express.Router()

router.post('/register',[
    body('email').isEmail().withMessage('Invalid email!'),
    body('fullname.firstname').isLength({min:3}).withMessage('must be alteast 3!'),
    body('password').isLength({min:6}).withMessage('required unit!')
],registerUser)

router.post('/login',[
     body('email').isEmail().withMessage('Invalid email!'),
     body('password').isLength({min:6}).withMessage('required unit!')
],loginUser)

export default router;