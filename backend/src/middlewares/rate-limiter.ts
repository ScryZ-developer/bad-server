import { NextFunction, Request, Response } from 'express'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const limiter = new RateLimiterMemory({
    points: Number(process.env.RATE_LIMIT_POINTS) || 10,
    duration: Number(process.env.RATE_LIMIT_DURATION) || 60,
    blockDuration: Number(process.env.RATE_LIMIT_BLOCK) || 60,
})

export default async function rateLimiter(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (process.env.RATE_LIMITED !== 'true') {
        return next()
    }

    try {
        await limiter.consume(req.ip || 'unknown')
        return next()
    } catch {
        return res
            .status(429)
            .json({ message: 'Слишком много запросов, попробуйте позже' })
    }
}
