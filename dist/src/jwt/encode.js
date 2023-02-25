"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
require('dotenv').config();
const encode = (data) => {
    const config = {
        expiresIn: '1d',
    };
    const SECRET = String(process.env.SECRET);
    return (0, jsonwebtoken_1.sign)(data, SECRET, config);
};
exports.encode = encode;
