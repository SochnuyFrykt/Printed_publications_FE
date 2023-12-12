import { Response, Router } from 'express'
import { check, validationResult } from 'express-validator'
import User from "../../models/User";
import { sha512 } from "js-sha512";
import * as jwt from "jsonwebtoken";
import config from "config";

const router = Router()

const props = [
    check('email').notEmpty().isEmail(),
    check('password').notEmpty().isString(),
]

const handle = async (req: any, res: Response) => {
    try {
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
        const trimmedEmail = email.trim().toLowerCase()


        const test = await User.findOne({
            email: trimmedEmail
        })
        if (!!test)
            return res.status(400).json({ message: 'Пользователь с таким логином или email уже зарегистрирован', error: true })

        const user = new User({
            email: trimmedEmail,
            password: sha512(password)
        })

        await user.save()

        const token = jwt.sign(
            { id: user.id, email: user.email },
            config.get('jwtSecret'),
            { expiresIn: '20d' }
        )

        res.status(200).json({
            data: {
                id: user.id,
                token,
                email: user.email,
            },
            error: false,
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: "Неизвестная ошибка", error: true })
    }
}

router.post('/', props, handle)

module.exports = router