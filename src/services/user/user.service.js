const { User } = require('../../database/models/')

class UserService {
    async findOne(options) {
        return await User.findOne(options)
    }
}

module.exports = {
    userService: new UserService()
}