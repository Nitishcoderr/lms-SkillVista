import Course from "../models/course.model.js"
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary'
import fs from 'fs/promises'

// GET ALL COURSE
const getAllCourses = async (req, res, next) => {
   try {
     const courses = await Course.find({}).select('-lectures');
 
     res.status(200).json({
         success:true,
         message:'All courses',
         courses,
     })
   } catch (e) {
    return next(new AppError(e.message || 'Something went wrong!, please try again', 500)
    )
   }
}

// GET LECTURES
const getLeacturesByCourseId = async (req, res, next) => {
    try {
        const {id} = req.params;
        const course = await Course.findById(id);
        if(!course){
            return next(new AppError('Invalid course id', 400)
            )
        }

        res.status(200).json({
            success:true,
            message:'Course leacture fetched successfully',
            lectures:course.lectures
        })
    } catch (e) {
        return next(new AppError(e.message || 'Something went wrong!, please try again', 500)
        )
    }
}

// CREATE COURSES

const  createCourse = async (req,res,next)=>{
    const {title,description,category,createdBy} = req.body;

    if(!title || !description || !category || !createdBy){
        return next(new AppError('All fields are required, please try again', 400)
        )
    }

    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail:{
            public_id:'Dummy',
            secure_url:'Dummy',
        },
    });
    if(!course){
        return next(
            new AppError('Course could not be created, please try again',500)
        )
    }
    if(req.file){
        const result = await cloudinary.v2.uploader.upload(req.file.path,{
            folder:'skillVista'
        })
        if(result){
            course.thumbnail.public_id = result.public_id;
            course.thumbnail.secure_url = result.secure_url;
        }
        fs.rm(`uploads/${req.file.filename}`)
    }
    await course.save()
    res.status(200).json({
        success:true,
        message:'Course creates successfully',
        course
    })
}

// UPDATE COURSES

const updateCourse = async (req,res,next)=>{
    try {
        const {id} = req.params;
        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set:req.body
            },
            {
                runValidators:true
            }
        );
        if(!course){
            return next(new AppError('Course with given id does not exist',500)
            )
        }
        res.status(200).json({
            success:true,
            message:'Course updated successfully',
            course
        })
    } catch (e) {
        return next(new AppError(e.message,500)
        )
    }
}

// REMOVE COURSES

const removeCourse = async (req,res,next)=>{
    try {
        const {id} = req.params;
        const course = await Course.findById(id);
        if(!course){
            return next(new AppError('Course with given id does not exist',500)
            )
        }
        await Course.findByIdAndDelete(id)

        res.status(200).json({
            success:true,
            message:'Course deleted successfully'
        })
    } catch (e) {
        return next(new AppError(e.message,500)
        )
    }
}

export { getAllCourses, getLeacturesByCourseId , createCourse,updateCourse ,removeCourse}