"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.deleteUser = exports.editUser = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const service = __importStar(require("../services/user"));
const encode_1 = require("../jwt/encode");
const error = (res) => res.status(500).json({ message: "Ocorreu um erro no servidor, tente novamente em instantes ou contate o suporte." });
const createUser = async (req, res) => {
    const { name, email, password, role } = req.body.data;
    const oldUser = await service.getUserByEmail(email);
    if (oldUser) {
        return res.status(409).json({ message: 'Usuário já cadastrado, por favor faça login.' });
    }
    const token = (0, encode_1.encode)({ email, name });
    let response = {
        name,
        email,
        password,
        role: role ? String(role).toUpperCase() : 'USER',
        token: String(token),
    };
    await service.postUser(response);
    return res.status(201).json(response);
    // } catch (e) {
    //     return error(res)
    // }
};
exports.createUser = createUser;
const getAllUsers = async (req, res) => {
    try {
        let meta = {
            page: 1,
            search: '',
            itemsPerPage: 30,
            orderBy: ['createdAt', 'desc']
        };
        if (req.body)
            meta = req.body.response.meta;
        const users = await service.getAllUsers(meta);
        const response = {
            data: users,
            meta
        };
        return res.status(200).json(response);
    }
    catch (e) {
        return error(res);
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await service.getUserById(id);
        if (!user) {
            return res.status(204).json({ message: 'Nenhum usuário encontrado.' });
        }
        const response = {
            data: user,
            meta: []
        };
        return res.status(200).json(response);
    }
    catch (e) {
        return error(res);
    }
};
exports.getUserById = getUserById;
const editUser = async (req, res) => {
    try {
        const { email, name, password, role } = req.body.data;
        const { id } = req.params;
        const token = (0, encode_1.encode)({ email, name });
        const data = {
            email,
            name,
            role,
            password,
            token: String(token)
        };
        const user = await service.putUser(data, id);
        const response = {
            data: user,
            meta: []
        };
        return res.status(200).json(response);
    }
    catch (e) {
        return error(res);
    }
};
exports.editUser = editUser;
const deleteUser = async (req, res) => {
    try {
        const { email } = req.body.data;
        const user = await service.deleteUser(email);
        const response = {
            data: user,
            meta: []
        };
        return res.status(200).json(response);
    }
    catch (e) {
        return error(res);
    }
};
exports.deleteUser = deleteUser;
const login = async (req, res) => {
    try {
        const { email, password } = req.body.data;
        const user = await service.getUserByEmail(email);
        if (user?.password == password) {
            const name = String(user?.name);
            const token = (0, encode_1.encode)({ email, name });
            const data = {
                name,
                email,
                token: String(token)
            };
            return res.status(200).json(data);
        }
        else {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }
    }
    catch (e) {
        return error(res);
    }
};
exports.login = login;
