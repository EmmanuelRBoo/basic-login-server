import { Router } from 'express'
import { login, createUser, getAllUsers, getUserById, editUser, deleteUser } from '../controllers/user'

const userRouter = Router()

userRouter.post('/login', login)
userRouter.post('/register', createUser)
userRouter.get('/users', getAllUsers)
userRouter.get('/user/:id', getUserById)
userRouter.put('/user/:id', editUser)
userRouter.delete('/user/:email', deleteUser)

export default userRouter