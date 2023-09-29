import {Router} from 'express'
import { getAllCourses, getLeacturesByCourseId } from '../controller/course.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

const router = Router()

router.route('/')
.get(getAllCourses);

router.route('/:id')
.get(isLoggedIn,getLeacturesByCourseId);


export default router;