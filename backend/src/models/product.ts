import { unlink } from 'fs'
import mongoose, { Document } from 'mongoose'
import { join } from 'path'

export interface IFile {
    fileName: string
    originalName: string
}

export interface IProduct extends Document {
    title: string
    image: IFile
    category: string
    description: string
    price: number
}

const cardsSchema = new mongoose.Schema<IProduct>(
    {
        title: {
            type: String,
            unique: true,
            required: [true, 'Поле "title" должно быть заполнено'],
            minlength: [2, 'Минимальная длина поля "title" - 2'],
            maxlength: [30, 'Максимальная длина поля "title" - 30'],
        },
        image: {
            fileName: {
                type: String,
                required: [true, 'Поле "image.fileName" должно быть заполнено'],
            },
            originalName: String,
        },
        category: {
            type: String,
            required: [true, 'Поле "category" должно быть заполнено'],
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            default: null,
        },
    },
    { versionKey: false }
)

cardsSchema.index({ title: 'text' })

const getSafeImagePath = (fileName: string) => {
    const imagePath = fileName.replace(/^\//, '')
    if (imagePath.includes('..')) {
        return null
    }
    return join(__dirname, '../public', imagePath)
}

cardsSchema.pre('findOneAndUpdate', async function deleteOldImage() {
    // @ts-ignore
    const updateImage = this.getUpdate().$set?.image
    const docToUpdate = await this.model.findOne(this.getQuery())
    if (updateImage && docToUpdate) {
        const safePath = getSafeImagePath(docToUpdate.image.fileName)
        if (safePath) {
            unlink(safePath, (err) => console.log(err))
        }
    }
})

cardsSchema.post('findOneAndDelete', async (doc: IProduct) => {
    const safePath = getSafeImagePath(doc.image.fileName)
    if (safePath) {
        unlink(safePath, (err) => console.log(err))
    }
})

export default mongoose.model<IProduct>('product', cardsSchema)
