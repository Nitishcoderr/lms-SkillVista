import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";

const cookieOptions = {
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    secure:true
}

// REGISTER

const register = async (req, res, next) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return next(new AppError('All fields are required', 400));
    }
    const userExists = await User.findOne({email});

    if(userExists){
        return next(new AppError('Email already exists', 400));
    }
    

    const user = await User.create({
        fullName,
        email,
        password,
        avatar:{
            public_id:email,
            secure_url:'https://avatars.githubusercontent.com/u/122970690?s=400&u=e54405d2c257b7f2f7f21e53bc77a48748770c54&v=4'
        }
    })

    if(!user){
        return next(new AppError('User registration failed,please try again',400))
    }

    // TODO: file upload

    await user.save();

    user.password = undefined;

    const token = await user.generateJWTToken()

    res.cookie('token',token,cookieOptions)

    res.status(201).json({
        success:true,
        message:'User registered successfully',
        user,
    })
}


// LOGIN

const login = (req, res) => {

}


// LOGOUT

const logout = (req, res) => {

}


// GETPROFILE

const getProfile = (req, res) => {

}

export { register, login, logout, getProfile }