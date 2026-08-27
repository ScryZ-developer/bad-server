import { ErrorRequestHandler } from 'express'

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).send({ message: 'Недействительный CSRF токен' })
        return next()
    }

    const statusCode = err.statusCode || 500
    const message =
        statusCode === 500 ? 'На сервере произошла ошибка' : err.message

    res.status(statusCode).send({ message })

    return next()
}

export default errorHandler
