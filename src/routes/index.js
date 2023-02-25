const express = require('express')
const user = require('../controllers/user.js')

const userRouter = express.Router()

userRouter.post('/login', user.login)
userRouter.post('/register', user.createUser)
userRouter.get('/users', user.getAllUsers)
userRouter.get('/user/:id', user.getUserById)
userRouter.put('/user/:id', user.editUser)
userRouter.delete('/user/:email', user.deleteUser)

module.exports = userRouter