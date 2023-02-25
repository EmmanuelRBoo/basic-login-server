import { prisma } from '../../prisma/prisma' 

interface IUser {
    name: string
    email?: string 
    password?: string
    role: string
    token: string
}

interface IMeta {
    search: string
    itemsPerPage: number
    page: number
    orderBy: any
}


export const postUser = async(data: IUser) => {
    const user = await prisma.user.create({ data: data })
    return user
}

export const getAllUsers = async(meta: IMeta) => {
    const pager = Number(meta.itemsPerPage) * (Number(meta.page) - 1)

    const ordenation = (order: any) => {
        let ordenation = {}

        switch (order[0]) {
            case 'nome': ordenation = { nome: order[1] }; break;
            case 'email': ordenation =  { email: order[1] }; break;
            case 'createdAt': ordenation =  { createdAt: order[1] }; break;
            default: ordenation =  { createdAt: 'desc' }; break;
        }

        return ordenation
    }

    const allUsers = await prisma.user.findMany({
        skip: meta.page == 1 ? 0 : pager,
        take: meta.itemsPerPage,
        orderBy: ordenation(meta.orderBy),
        where: { name: { contains: meta.search } }
    })

    return allUsers
}

export const getUserById = async(id: string) => {
    const user = await prisma.user.findUnique({ where: { id } })

    return user
}

export const getUserByEmail = async(email: string) => {
    const user = await prisma.user.findUnique({ where: { email } })

    return user
}

export const putUser = async(data: IUser, id: string) => {
    const user = await prisma.user.update({ where: { id }, data })

    return user
}

export const deleteUser = async(id: string) => {
    const user = await prisma.user.delete({ where: { id } })

    return user
}