import { Router } from 'express'
import { addLectureToCourseById, createCourse, getAllCourses, getLeacturesByCourseId, removeCourse, updateCourse } from '../controller/course.controller.js';
import { authorizeSubscriber, authorizedRoles, isLoggedIn } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const router = Router()

router.route('/')
    .get(getAllCourses)
    .post(isLoggedIn, authorizedRoles('ADMIN'), upload.single('thumbnail'), createCourse)


router.route('/:id')
    .get(isLoggedIn, authorizeSubscriber, getLeacturesByCourseId)
    .put(isLoggedIn, authorizedRoles('ADMIN'), updateCourse)
    .delete(isLoggedIn, authorizedRoles('ADMIN'), removeCourse)
    .post(isLoggedIn, authorizedRoles('ADMIN'), upload.single('lecture'), addLectureToCourseById)

export default router;