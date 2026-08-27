import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import { unlink } from 'fs/promises'
import BadRequestError from '../errors/bad-request-error'

const MIN_FILE_SIZE = 2 * 1024
const MAX_FILE_SIZE = 10 * 1024 * 1024

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }

    const { path: filePath, size, filename } = req.file

    if (size < MIN_FILE_SIZE || size > MAX_FILE_SIZE) {
        await unlink(filePath).catch(() => {})
        return next(new BadRequestError('Некорректный размер файла'))
    }

    try {
        const sharp = (await import('sharp')).default
        await sharp(filePath).metadata()
    } catch {
        await unlink(filePath).catch(() => {})
        return next(new BadRequestError('Некорректный файл изображения'))
    }

    try {
        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${filename}`
            : `/${filename}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
