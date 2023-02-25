import { Request, Response } from 'express'

import * as service from '../services/user'
import { encode } from '../jwt/encode'

const error = (res: Response, error: any) => res.status(500).json({ message: "Ocorreu um erro no servidor, tente novamente em instantes ou contate o suporte.", error })

export const createUser = async (req: Request, res: Response) => {

    try{
        const { name, email, password, role } = req.body.data

        const oldUser = await service.getUserByEmail(email)

        if (oldUser) {
            return  res.status(409).json({ message: 'Usuário já cadastrado, por favor faça login.' })
        }

        const token = encode({ email, name })

        let response = { 
            name, 
            email, 
            password,
            role: role ? String(role).toUpperCase() : 'USER', 
            token: String(token),
        }

        await service.postUser(response)

        return res.status(201).json(response)
    } catch (e) {
        return error(res, e)
    }
}

export const getAllUsers = async (req: Request, res: Response) => {

        try {

            let body = req.body

            let meta = {
                page: 1,
                search: '',
                itemsPerPage: 30,
                orderBy: ['createdAt', 'desc']
            }
    
            if (body.hasOwnProperty('response')) meta = body.response.meta
    
            const users = await service.getAllUsers(meta)

            const response = {
                data: users,
                meta
            }
    
            return res.status(200).json(response)
        } catch(e) {
            return error(res, e)
        }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const user = await service.getUserById(id)

        if (!user) {
            return res.status(204).json({ message: 'Nenhum usuário encontrado.'})
        }

        const response = {
            data: user,
            meta: []
        }

        return res.status(200).json(response)
    } catch (e) {
        return error(res, e)
    }
}

export const editUser = async (req: Request, res: Response) => {
    try {
        const { email, name, password, role } = req.body.data
        const { id } = req.params

        const token = encode({ email, name })

        const data = {
            email,
            name,
            role,
            password,
            token: String(token)
        }

        const user = await service.putUser(data, id)

        const response = {
            data: user,
            meta: []
        }

        return res.status(200).json(response)
    } catch (e) {
        return error(res, e)
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { email } = req.body.data

        const user = await service.deleteUser(email)

        const response = {
            data: user,
            meta: []
        }

        return res.status(200).json(response)
    } catch (e) {
        return error(res, e)
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body.data

        const user = await service.getUserByEmail(email)

        if (user?.password == password) {
            const name = String(user?.name)

            const token = encode({ email, name })

            const data = { 
                name, 
                email, 
                token: String(token)
            }
            
            return res.status(200).json(data)
        } else {

            return res.status(400).json({ message: 'Credenciais inválidas' })
        }
    } catch (e) {
        return error(res, e)
    }
}
