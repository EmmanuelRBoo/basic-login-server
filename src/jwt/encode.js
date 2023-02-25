const { sign } = require('jsonwebtoken')

require('dotenv').config()

const encode = (data) => {

    const config = {
        expiresIn: '1d',
    }

    const SECRET = String(process.env.SECRET)

    return sign(data, SECRET, config)
}

module.exports = encode