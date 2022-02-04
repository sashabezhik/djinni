const { User } = require('../../database/models/')
const { userInfoService } = require('../user/userInfo.service')
const { cryptoService } = require('../crypto/crypto.service')

class LoginService {
    init() {
        cryptoService.init()
    }

    async checkIfUserExists(email) {
        const userExists = await userInfoService.findUserByEmail(email)
        return Boolean(userExists)
    }

    async comparePasswords(password, userPassword) {
        return cryptoService.compare(password, userPassword)
    }

    // Delete

    async createUser(email, password) {
        await User.create({ email, password })
    }
}

module.exports = {
    loginService: new LoginService()
}