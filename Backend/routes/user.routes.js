import express from 'express'
import {body} from 'express-validator'
import {registerUser,loginUser,getUserProfile, logOut} from '../controllers/user.controller.js'
import authUser from '../middlewares/auth.middleware.js'

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

router.get('/profile',authUser,getUserProfile);
router.post('/logout',authUser,logOut)

export default router;