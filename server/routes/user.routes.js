import { Router } from "express";
import { getProfile, login, logout, register } from "../controller/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = Router()


router.post('/register',upload.single("avatar"),register)
router.post('/login',login)
router.get('/logout',logout)
router.get('/me',isLoggedIn,getProfile)


export default  router