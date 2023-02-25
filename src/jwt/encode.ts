import { sign } from 'jsonwebtoken'

require('dotenv').config()

interface IEncode {
    email: string,
    name: string
}

export const encode = (data: IEncode) => {

    const config = {
        expiresIn: '1d',
    }

    const SECRET = String(process.env.SECRET)

    return sign(data, SECRET, config)
}