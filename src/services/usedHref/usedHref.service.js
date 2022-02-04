const { UsedHref } = require('../../database/models')

class UsedHrefService {
    async findOne(options) {
        return await UsedHref.findOne(options)
    }

    async create(options) {
        await UsedHref.create(options)
    }
}

module.exports = {
    usedHrefService: new UsedHrefService()
}