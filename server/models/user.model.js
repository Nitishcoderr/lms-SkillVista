import { Schema,model } from "mongoose";

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
})

const User = model('User',userSchema)

export default User;