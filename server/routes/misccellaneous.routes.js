import { Router } from 'express';
import { contactUs, userStats } from '../controller/miscellaneous.controller.js';
import { authorizedRoles, isLoggedIn } from '../middleware/auth.middleware.js';

const miscRouter = Router();

miscRouter.post('/contact', contactUs);
miscRouter.get('/admin/stats/users', isLoggedIn, authorizedRoles('ADMIN'), userStats);

export default miscRouter;