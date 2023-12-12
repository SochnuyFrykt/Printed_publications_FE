import { Router } from 'express'

const auth = require('../../functions/auth.middleware')

const router = Router()

router.use('/auth', require('./auth'))
router.use('/register', require('./register'))

module.exports = router