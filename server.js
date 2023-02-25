const express = require('express')
const cors = require('cors')
const userRouter = require('./src/routes')

require('dotenv').config()

const PORT = Number(process.env.PORT)

var app = express()

app.use(express.json())
app.use(cors())

app.use('/', userRouter)

app.listen(PORT, () => console.log('Escutando na porta:', PORT))