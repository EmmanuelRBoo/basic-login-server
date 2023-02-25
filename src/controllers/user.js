const service = require('../services/user')
const encode = require('../jwt/encode')

const error = (res) => res.status(500).json({ message: "Ocorreu um erro no servidor, tente novamente em instantes ou contate o suporte." })

const createUser = async(req, res) => {

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
    // } catch (e) {
    //     return error(res)
    // }
}

const getAllUsers = async (req, res) => {

        try {
            let meta = {
                page: 1,
                search: '',
                itemsPerPage: 30,
                orderBy: ['createdAt', 'desc']
            }
    
            if (req.body) meta = req.body.response.meta
    
            const users = await service.getAllUsers(meta)
    
            const response = {
                data: users,
                meta
            }
    
            return res.status(200).json(response)
        } catch(e) {
            return error(res)
        }
}

const getUserById = async (req, res) => {
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
        return error(res)
    }
}

const editUser = async (req, res) => {
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
        return error(res)
    }
}

const deleteUser = async(req, res) => {
    try {
        const { email } = req.body.data

        const user = await service.deleteUser(email)

        const response = {
            data: user,
            meta: []
        }

        return res.status(200).json(response)
    } catch (e) {
        return error(res)
    }
}

const login = async(req, res) => {
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
        return error(res)
    }
}

module.exports = {
    createUser,
    deleteUser,
    editUser,
    getAllUsers,
    getUserById,
    login
}
