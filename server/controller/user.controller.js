import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary'
import fs from 'fs/promises'

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
        return next(new AppError('Failed to register user',400))
    }

    // file upload on cloudinary

    console.log(`File details > ${JSON.stringify(req.file)}`);
    if(req.file){
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'skillVista',
                width:250,
                height:250,
                gravity:'faces',
                crop:'fill'
            });
            if(result){
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;
                // Remove file from server
                fs.rm(`uploads/${req.file.filename}`)
            }
        } catch (e) {
            return next(new AppError(e.message || 'File not uploaded, please try again',500)
            )
        }
    }


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

const login = async (req, res,next) => {
   try {
     const {email,password} = req.body;
 
     if(!email || !password){
         return next(new AppError('All fields are required',400))
     }
     const user = await User.findOne({
         email
     }).select('+password')
 
     if(!user || !user.comparePassword(password)){
         return next(new AppError('Email or password does not match',400))
     }
     const token = await user.generateJWTToken();
     user.password = undefined
 
     res.cookie('token',token,cookieOptions)
 
     res.status(200).json({
         success:true,
         message:'User logged in successfully',
         user,
     })
   } catch (e) {
    return next(new AppError(e.message,500))
    
   }
}


// LOGOUT

const logout = (req, res) => {
    res.cookie('token',null,{
        secure:true,
        maxAge:0,
        httpOnly:true
    });
    res.status(200).json({
        success:true,
        message:'User logged out successfully'
    })
}


// GETPROFILE

const getProfile = async (req, res) => {
  try {
      const userId = req.user.id;
      const user = await User.findById(userId)

      res.status(200).json({
        success:true,
        message:'User details',
        user
      })
  } catch (e) {
    return next(new AppError('Failed to fetch profile details',200))
  }
}

export { register, login, logout, getProfile }