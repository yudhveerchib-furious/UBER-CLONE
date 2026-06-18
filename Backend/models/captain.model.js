import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const captainSchema = new mongoose.Schema({
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
        lowercase: true
    },
    password:{
        type:String,
        required: true,
        select: false
    },
    socketId:{
       type: String 
    },
    status:{
        type: String,
        enum: ['active','inactive'],
        default: 'inactive'
    },
    vehicle:{
        color:{
            type: String,
            required: true,
            minlength:[3,'must be at least 3 chars!']
        },
        plate:{
            type: String,
            required: true,
            minlength:[3,'must be at least 3 chars!']
        },
        capacity:{
            type: Number,
            required: true,
            minlength:[1,'atleast must be 1 capacity!']
        },
        vehicleType:{
            type: String,
            required: true,
            enum: ['car','auto','bike']
        },
        location:{
            lat:{
                type: Number
            },
            long: {
                type: Number
            }
        }
    }
})

captainSchema.methods.generateAuthToken = function(){
            const token = jwt.sign({
                _id: this._id
            },
          process.env.JWT_SECRET,
          { expiresIn: '24h' })
        return token;
}

captainSchema.methods.comparePassword = async function(password){
   return await bcrypt.compare(password,this.password)
}

captainSchema.statics.hashPassword = (password)=>{
    return bcrypt.hash(password,10);
}

export const captainModel = mongoose.model('captain',captainSchema)