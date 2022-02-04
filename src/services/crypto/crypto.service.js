const crypto = require('crypto-js')

class CryptoService {
    _secretToken

    init() {
        this._secretToken = process.env.CRYPTO_SECRET_TOKEN
    }

    encrypt(password) {
        return crypto.AES.encrypt(password, this._secretToken).toString()
    }

    decrypt(password) {
        const bytes = crypto.AES.decrypt(password, this._secretToken)
        return bytes.toString(crypto.enc.Utf8)
    }

    compare(password, userPassword) {
        const userPasswordDecrypted = this.decrypt(userPassword).toString()
        return password === userPasswordDecrypted
    }
}

module.exports = {
    cryptoService: new CryptoService()
}