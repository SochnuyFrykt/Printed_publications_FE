import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import config from 'config'
import { readdirSync } from 'fs'
import './functions/mongo'

const app = express()

const isProduction = process.env.NODE_ENV === 'production'

app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.json({ limit: '50mb' }))

const getDirectories = (source: string) =>
    readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)


process.stdout.write(`[*] Load routes: `)
for (const route of getDirectories('./routes')) {
    app.use(`/api/${route}`, require(`./routes/${route}`))
    process.stdout.write(`${route} `)
}

app.use('/img', express.static(path.join(__dirname, './img')))

if (isProduction) {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
    app.get('*', (_, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err)

    res.status(500).json({ error: true, message: 'Неизвестная ошибка' })
});

const PORT = process.env.PORT || config.get('port') || 5000

process.once('SIGUSR2', () => process.kill(process.pid, 'SIGUSR2'))
process.on('SIGINT', () => process.kill(process.pid, 'SIGINT'))

app.listen(PORT, () => {
    const type = isProduction
        ? 'production'
        : 'development'
    console.log(`\n[*] App has been started on port ${PORT} | ${type}`)
})
