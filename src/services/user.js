const prisma = require('../../prisma/prisma') 

const postUser = async(data) => {
    const user = await prisma.user.create({ data: data })
    return user
}

const getAllUsers = async(meta) => {
    const pager = Number(meta.itemsPerPage) * (Number(meta.page) - 1)

    const ordenation = (order) => {
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

const getUserById = async(id) => {
    const user = await prisma.user.findUnique({ where: { id } })

    return user
}

const getUserByEmail = async(email) => {
    const user = await prisma.user.findUnique({ where: { email } })

    return user
}

const putUser = async(data, id) => {
    const user = await prisma.user.update({ where: { id }, data })

    return user
}

const deleteUser = async(id) => {
    const user = await prisma.user.delete({ where: { id } })

    return user
}

module.exports = {
    deleteUser,
    getAllUsers,
    getUserByEmail,
    getUserById,
    postUser,
    putUser
}