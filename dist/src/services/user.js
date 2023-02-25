"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.putUser = exports.getUserByEmail = exports.getUserById = exports.getAllUsers = exports.postUser = void 0;
const prisma_1 = require("../../prisma/prisma");
const postUser = async (data) => {
    const user = await prisma_1.prisma.user.create({ data: data });
    return user;
};
exports.postUser = postUser;
const getAllUsers = async (meta) => {
    const pager = Number(meta.itemsPerPage) * (Number(meta.page) - 1);
    const ordenation = (order) => {
        let ordenation = {};
        switch (order[0]) {
            case 'nome':
                ordenation = { nome: order[1] };
                break;
            case 'email':
                ordenation = { email: order[1] };
                break;
            case 'createdAt':
                ordenation = { createdAt: order[1] };
                break;
            default:
                ordenation = { createdAt: 'desc' };
                break;
        }
        return ordenation;
    };
    const allUsers = await prisma_1.prisma.user.findMany({
        skip: meta.page == 1 ? 0 : pager,
        take: meta.itemsPerPage,
        orderBy: ordenation(meta.orderBy),
        where: { name: { contains: meta.search } }
    });
    return allUsers;
};
exports.getAllUsers = getAllUsers;
const getUserById = async (id) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { id } });
    return user;
};
exports.getUserById = getUserById;
const getUserByEmail = async (email) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    return user;
};
exports.getUserByEmail = getUserByEmail;
const putUser = async (data, id) => {
    const user = await prisma_1.prisma.user.update({ where: { id }, data });
    return user;
};
exports.putUser = putUser;
const deleteUser = async (id) => {
    const user = await prisma_1.prisma.user.delete({ where: { id } });
    return user;
};
exports.deleteUser = deleteUser;
