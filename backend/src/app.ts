import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { DB_ADDRESS, ORIGIN_ALLOW } from './config'
import csrfProtection from './middlewares/csrf'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'

const { PORT = 3000 } = process.env
const app = express()

app.use(cookieParser())
app.use(
    cors({
        origin: ORIGIN_ALLOW,
        credentials: true,
    })
)

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true, limit: '10kb' }))
app.use(json({ limit: '10kb' }))

app.use(csrfProtection)

app.get('/auth/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() })
})

app.options('*', cors({ origin: ORIGIN_ALLOW, credentials: true }))
app.use(routes)
app.use(errors())
app.use(errorHandler)

const connectDatabase = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
    } catch (error) {
        console.error('MongoDB connection error, retrying in 5s...', error)
        setTimeout(connectDatabase, 5000)
    }
}

const bootstrap = async () => {
    app.listen(PORT, () => {
        console.log('ok')
        connectDatabase().catch((error) => {
            console.error(error)
        })
    })
}

bootstrap()
