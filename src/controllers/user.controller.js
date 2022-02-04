const { userInfoService } = require('../services/user/userInfo.service')
const { loginService } = require('../services/auth/login.service')
const { tokenService } = require('../services/token/token.service')
const { cryptoService } = require('../services/crypto/crypto.service')

class UserController {
    _message 

    constructor() {
        this._message = 'Incorrect email or password.'   
    }

    init() {
        tokenService.init()
        loginService.init()
    }

    async logIn(req, res) {
        try {
            const { email, password } = req.body

            const userExists = await loginService.checkIfUserExists(email)
            if (!userExists) return res.status(400).json({ message: this._message })

            const user = await userInfoService.findUserByEmail(email)

            const passwordCorrect = await loginService.comparePasswords(password, user.password)
            if (!passwordCorrect) return res.status(400).json({ message: this._message })

            const token = tokenService.generateToken(user.id)

            res.status(200).json({ token })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    async getUserInfo(req, res) {
        try {
            const id = req.userId

            const userExists = await userInfoService.findUserById(id)
            if (!userExists) return res.status(400).json({ message: 'User not found' })

            return res.status(200).json({ userInfo: { email: userExists.email } })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    async getActiveMailings(req, res) {
        try {
            const id = req.userId
            const activeMailings = await userInfoService.getUserMailingsById(id)
            
            return res.status(200).json({ activeMailings })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }
}

module.exports = {
    userController: new UserController()
}