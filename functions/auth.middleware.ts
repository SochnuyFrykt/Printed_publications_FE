import * as jwt from 'jsonwebtoken'
import config from 'config'
import User from '../models/User'
import { Response, NextFunction } from 'express'

module.exports = async (req: any, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]

        if (!token) {
            return res.status(401).json({ message: 'Неправильный логин или пароль', error: true })
        }

        const decoded: any = jwt.verify(token, config.get('jwtSecret'))

        const user = await User.findById(decoded.id)

        if (!user)
            return res.status(401).json({ message: 'Неправильный логин или пароль', error: true })

        req.user = decoded

        next()
    } catch (e) {
        console.error(e)
        return res.status(401).json({ message: 'Неправильный логин или пароль', error: true })
    }
}