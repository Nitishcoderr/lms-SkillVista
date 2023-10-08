import Course from "../models/course.model.js"
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary'
import fs from 'fs/promises'

// GET ALL COURSE
const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({}).select('-lectures');

        res.status(200).json({
            success: true,
            message: 'All courses',
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
        const { id } = req.params;
        const course = await Course.findById(id);
        if (!course) {
            return next(new AppError('Invalid course id', 400)
            )
        }

        res.status(200).json({
            success: true,
            message: 'Course leacture fetched successfully',
            lectures: course.lectures
        })
    } catch (e) {
        return next(new AppError(e.message || 'Something went wrong!, please try again', 500)
        )
    }
}

// CREATE COURSES

const createCourse = async (req, res, next) => {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
        return next(new AppError('All fields are required, please try again', 400)
        )
    }

    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail: {
            public_id: 'Dummy',
            secure_url: 'Dummy',
        },
    });
    if (!course) {
        return next(
            new AppError('Course could not be created, please try again', 500)
        )
    }
    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'skillVista'
            })
            if (result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }
            fs.rm(`uploads/${req.file.filename}`)
        } catch (error) {
            return next(
                new AppError(error.message, 500)
            )
        }
    }
    await course.save()
    res.status(200).json({
        success: true,
        message: 'Course creates successfully',
        course
    })
}

// UPDATE COURSES

const updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set: req.body
            },
            {
                runValidators: true
            }
        );
        if (!course) {
            return next(new AppError('Course with given id does not exist', 500)
            )
        }
        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            course
        })
    } catch (e) {
        return next(new AppError(e.message, 500)
        )
    }
}

// REMOVE COURSES

const removeCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        if (!course) {
            return next(new AppError('Course with given id does not exist', 500)
            )
        }
        await Course.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        })
    } catch (e) {
        return next(new AppError(e.message, 500)
        )
    }
}

const addLectureToCourseById = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const { id } = req.params;

        if (!title || !description) {
            return next(new AppError('All fields are required, please try again', 400)
            )
        }

        const course = await Course.findById(id);

        if (!course) {
            return next(new AppError('Course with given id does not exist', 500)
            )
        }
        const lectureData = {
            title,
            description,
            lecture: {}
        };
        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'skillVista',
                    chunk_size:50000000,
                    resource_type:'video'
                })
                if (result) {
                    lectureData.lecture.public_id = result.public_id;
                    lectureData.lecture.secure_url = result.secure_url;
                }
                fs.rm(`uploads/${req.file.filename}`)
            } catch (error) {
                return next(
                    new AppError(error.message, 500)
                )
            }
        }

        console.log(`Lecture ${JSON.stringify(lectureData)}`)

        course.lectures.push(lectureData);

        course.numbersOfLectures = course.lectures.length;

        await course.save()

        res.status(200).json({
            success: true,
            message: 'Lecture successfully added to course',
            course
        })
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }

}


const removeLectureFromCourse = async (req, res, next) => {
    const { courseId, lectureId } = req.query;

    // Checking if both courseId and lectureId are present
    if (!courseId) {
        return next(new AppError('Course ID is required', 400));
    }

    if (!lectureId) {
        return next(new AppError('Lecture ID is required', 400));
    }

    const course = await Course.findById(courseId);

    // If no course send custom message
    if (!course) {
        return next(new AppError('Invalid ID or Course does not exist.', 404));
    }

    // Find the index of the lecture using the lectureId
    const lectureIndex = course.lectures.findIndex(
        (lecture) => lecture._id.toString() === lectureId.toString()
    );

    // If returned index is -1 then send error as mentioned below
    if (lectureIndex === -1) {
        return next(new AppError('Lecture does not exist.', 404));
    }

    // Delete the lecture from cloudinary
    await cloudinary.v2.uploader.destroy(
        course.lectures[lectureIndex].lecture.public_id,
        {
            resource_type: 'video',
        }
    );

    // Remove the lecture from the array
    course.lectures.splice(lectureIndex, 1);

    // update the number of lectures based on lectres array length
    course.numberOfLectures = course.lectures.length;

    // Save the course object
    await course.save();

    // Return response
    res.status(200).json({
        success: true,
        message: 'Course lecture removed successfully',
    });
};


export { getAllCourses, getLeacturesByCourseId, createCourse, updateCourse, removeCourse, addLectureToCourseById ,removeLectureFromCourse}