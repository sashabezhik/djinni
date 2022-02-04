const { tokenService } = require('../services/token/token.service')

class UserTokenValidator {
    verifyToken(req, res, next) {
        try {
            const authHeader = req?.header('Authorization')
            if (!authHeader) return res.status(400).json({ message: 'Authorization is required' })

            const token = authHeader.split(' ')[1]
            if (!token) return res.status(401).json({ message: 'Unauthorized' })

            const { id } = tokenService.verifyToken(token)
            req.userId = id

            next()
        } catch (err) {
            return res.status(400).json({ message: 'Invalid token' })
        }
    }
}

module.exports = {
    userTokenValidator: new UserTokenValidator()
}