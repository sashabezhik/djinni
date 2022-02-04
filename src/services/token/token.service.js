const jwt = require('jsonwebtoken')

class TokenService {
    _secretToken
    
    init() {
        this._secretToken = process.env.JWT_SECRET_TOKEN
    }

    generateToken(id) {
        return jwt.sign({ id }, this._secretToken)  
    }

    verifyToken(token) {
        return jwt.verify(token, this._secretToken)
    }
}

module.exports = {
    tokenService: new TokenService()
}