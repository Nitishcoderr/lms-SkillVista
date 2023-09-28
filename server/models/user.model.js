import { Schema,model } from "mongoose";
import bcrypt from 'bcryptjs'
import  jwt  from "jsonwebtoken";
import crypto from 'crypto'

const userSchema = new Schema({
    fullName:{
        type:'String',
        required:[true,'Name is required'],
        minLength:[5,'Name must be at least 5 character'],
        maxLength:[50,'Name should be less then 50 character'],
        lowercase:true,
        trim:true
    },
    email:{
        type:'String',
        required:[true,'Email is required'],
        lowercase:true,
        trim:true,
        unique:true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please fill in a valid  email address"
    ]
    },
    password:{
        type:'String',
        required:[true,'Password is required'],
        minLength: [5, 'Password must be at least 5 character'],
        select: false
    },
    avatar: {
        public_id: {
            type: "string"
        },
        secure_url: {
            type: "String"
        },
    },
    role: {
        type: "String",
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    forgetPasswordToken:String,
    forgetPasswordExpiry:Date
},{
    timestamps:true
});


userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password,10);
})


userSchema.methods = {
    generateJWTToken: async function () {
        return await jwt.sign(
            {
                id: this._id, email: this.email, subscription: this.subscription,
                role: this.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY,
            }

        )
    },
    comparePassword: async function(plainTextPassword){
        return await bcrypt.compare(plainTextPassword,this.password)
    },
    generatePasswordResetToken: async function (){
        const resetToken = crypto.randomBytes(20).toString('hex');

        this.forgetPasswordToken=crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
        this.forgetPasswordExpiry=Date.now() + 15 *60 *1000 //15 minute

        return resetToken;
    }
}

const User = model('User',userSchema)

export default User;