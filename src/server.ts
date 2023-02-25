import express from 'express'
import cors from 'cors'
import userRouter from './routes'

require('dotenv').config()

const PORT = Number(process.env.PORT)

var app = express()

app.use(express.json())
app.use(cors())

app.use('/', userRouter)

app.listen(PORT, () => console.log('Escutando na porta:', PORT))