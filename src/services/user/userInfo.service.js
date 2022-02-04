const { userService } = require('./user.service')

class UserInfoService {
    async findUserById(id) {
        return await userService.findOne({ where: {
            id
        }})
    }

    async findUserByEmail(email) {
        return await userService.findOne({ where: {
            email
        }})
    }

    async getUserMailingsById(id) {
        const user = await this.findUserById(id)
        if (!user) throw new Error('User not found')

        return await user.getMailings()
    }
}

module.exports = {
    userInfoService: new UserInfoService()
}