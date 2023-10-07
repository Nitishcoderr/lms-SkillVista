import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary'
import fs from 'fs/promises'
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto'

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true
}

// REGISTER

const register = async (req, res, next) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return next(new AppError('All fields are required', 400));
    }
    const userExists = await User.findOne({ email });

    if (userExists) {
        return next(new AppError('Email already exists', 400));
    }


    const user = await User.create({
        fullName,
        email,
        password,
        avatar: {
            public_id: email,
            secure_url: 'https://avatars.githubusercontent.com/u/122970690?s=400&u=e54405d2c257b7f2f7f21e53bc77a48748770c54&v=4'
        }
    })

    if (!user) {
        return next(new AppError('Failed to register user', 400))
    }

    // file upload on cloudinary

    // console.log(`File details > ${JSON.stringify(req.file)}`);
    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'skillVista',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            });
            if (result) {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;
                // Remove file from server
                fs.rm(`uploads/${req.file.filename}`)
            }
        } catch (e) {
            return next(new AppError(e.message || 'File not uploaded, please try again', 500)
            )
        }
    }


    await user.save();

    user.password = undefined;

    const token = await user.generateJWTToken()

    res.cookie('token', token, cookieOptions)

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user,
    })
}


// LOGIN

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('All fields are required', 400))
        }
        const user = await User.findOne({
            email
        }).select('+password')

        if (!user || !user.comparePassword(password)) {
            return next(new AppError('Email or password does not match', 400))
        }
        const token = await user.generateJWTToken();
        user.password = undefined

        res.cookie('token', token, cookieOptions)

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user,
        })
    } catch (e) {
        return next(new AppError(e.message, 500))

    }
}


// LOGOUT

const logout = (req, res) => {
    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: 'User logged out successfully'
    })
}


// GETPROFILE

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
          success: true,
          message: 'User details',
          user,
        });
    } catch (e) {
        return next(new AppError('Failed to fetch profile details', 200))
    }
}


// Forget password

const forgotPassword = async (req, res, next) => {
    const { email } = req.body
    if (!email) {
        return next(new AppError('Email is required', 400))
    }
    const user = await User.findOne({ email })
    if (!user) {
        return next(new AppError('Email not registered', 400))
    }
    const resetToken = await user.generatePasswordResetToken();

    await user.save();
    const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    console.log(resetPasswordURL);

    const subject = 'Reset password';
    const message = `You can reset your password by clicking <a href='${resetPasswordURL}' target='_blank' >Reset your password</a> \n If the above link does not work for some reason then copy paste this link in new tab ${resetPasswordURL}.\n If you have not requested this, kindly ignore this message`

    try {
        await sendEmail(email, subject, message);
        res.status(200).json({
            success: true,
            message: `Reset password token has been sent to ${email} successfully`
        })
    } catch (error) {
        user.forgetPasswordExpiry = undefined,
            user.forgetPasswordToken = undefined

        await user.save()
        return next(new AppError(error.message, 500))
    }

}

// Reset password
const resetPassword = async (req, res, next) => {
    const { resetToken } = req.params

    const { password } = req.body;

    const forgetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    const user = await User.findOne({
        forgetPasswordToken,
        forgetPasswordExpiry: { $gt: Date.now() }
    })
    if (!user) {
        return next(
            new AppError('Token is invalid or expired, please try again', 400)
        )
    }
    user.password = password;
    user.forgetPasswordToken = undefined;
    user.forgetPasswordExpiry = undefined;
    user.save()

    res.status(200).json({
        success: true,
        message: 'Password changed successfully!'

    })
}

const changePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;

    if (!oldPassword || !newPassword) {
        return next(
            new AppError('All fields are mandatory', 400)
        )
    }

    const user = await User.findById(id).select('+password')
    if (!user) {
        return next(
            new AppError('User does not exit', 400)
        )
    }
    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) {
        return next(
            new AppError('Invalid old password', 400)
        )
    }

    user.password = newPassword;

    await user.save();
    user.password = undefined;
    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    })
}


// Update user

const updateUser = async (req, res, next) => {
    const { fullName } = req.body;
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
        return next(
            new AppError('User does not exist', 400)
        )
    }
    if (fullName) {
        user.fullName = fullName;
    }
    if (req.file) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id)
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'skillVista',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            });
            if (result) {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;
                // Remove file from server
                fs.rm(`uploads/${req.file.filename}`)
            }
        } catch (e) {
            return next(new AppError(e.message || 'File not uploaded, please try again', 500)
            )
        }
    }
    await user.save()
    res.status(200).json({
        success: true,
        message: 'User details updated successfully!'
    })
}

export { register, login, logout, getProfile, forgotPassword, resetPassword, changePassword, updateUser }