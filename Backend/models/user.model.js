import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type: String,
            required: true,
            minlength:[3,'First name must be at least 3 chars!']
        },
        lastname:{
            type: String,
            minlength:[3,'last name must be at least 3 chars!']
        }
        
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required: true,
        select: false
    },
    socketId:{
        type: String,
    },
})

userSchema.methods.generateAuthToken = function(){
            const token = jwt.sign({
                _id: this._id
            },
          process.env.JWT_SECRET,
          { expiresIn: '24h' })
        return token;
}

userSchema.methods.comparePasword = async function(password){
   return await bcrypt.compare(password,this.password)
}

userSchema.statics.hashPassword = (password)=>{
    return bcrypt.hash(password,10);
}

const userModel = mongoose.model('user', userSchema);

export default userModel;