import { Schema, model } from 'mongoose'
import { IUser } from '../types/User'

const schema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true })

const Model = model<IUser>('User', schema)

export default Model