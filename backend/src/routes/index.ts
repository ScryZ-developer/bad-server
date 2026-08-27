import { NextFunction, Request, Response, Router } from 'express'
import NotFoundError from '../errors/not-found-error'
import auth from '../middlewares/auth'
import rateLimiter from '../middlewares/rate-limiter'
import authRouter from './auth'
import customerRouter from './customers'
import orderRouter from './order'
import productRouter from './product'
import uploadRouter from './upload'

const router = Router()

router.use('/auth', authRouter)
router.use('/product', rateLimiter, productRouter)
router.use('/order', rateLimiter, auth, orderRouter)
router.use('/upload', rateLimiter, auth, uploadRouter)
router.use('/customers', rateLimiter, auth, customerRouter)

router.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError('Маршрут не найден'))
})

export default router
