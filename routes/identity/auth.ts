import { Response, Router } from 'express'
import { check, validationResult } from 'express-validator'
import { sha512 } from 'js-sha512'
import * as jwt from 'jsonwebtoken'
import config from 'config'
import User from '../../models/User'

const router = Router()

const props = [
    check('email').notEmpty().isEmail(),
    check('password').notEmpty().isString(),
]

const handle = async (req: any, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        console.log(req.body)
        return res.status(400).json({
            errors: errors.array(),
            message: "Неправильные входные параметры",
            error: true
        })
    }

    const { email, password } = req.body

    const user = await User.findOne({email: email.toLowerCase()})

    if (!user)
        return res.json({ message: 'Неправильный логин или пароль', error: true })

    const isMatch = sha512(password) === user.password

    if (!isMatch)
        return res.json({ message: 'Неправильный логин или пароль', error: true })

    const token = jwt.sign(
        { id: user.id },
        config.get('jwtSecret'),
        { expiresIn: '20d' }
    )

    res.status(200).json({
        data: {
            id: user.id,
            email: user.email,
            token,
        },
        error: false,
    })
}

router.post('/', props, handle)

module.exports = router