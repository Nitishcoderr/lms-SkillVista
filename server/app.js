import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/user.routes.js'
import courseRoutes from './routes/course.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import { config } from 'dotenv'
import morgan from 'morgan'
import errorMiddleware from './middleware/error.middleware.js'
import miscRouter from './routes/misccellaneous.routes.js'
config()

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}))

app.use(cookieParser())

app.use(morgan('dev'))

// routes
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/courses', courseRoutes)
app.use('/api/v1/payments', paymentRoutes)
app.use('/api/v1', miscRouter);

app.all('*', (req, res) => {
    res.status(404).send('OOPS! 404 page not found')
})


app.use(errorMiddleware);

export default app;