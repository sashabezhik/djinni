const { Mailing } = require('../../database/models/')

class MailingService {
    async findOne(options) {
        return await Mailing.findOne(options)
    }

    async findAll(options = {}) {
        return await Mailing.findAll(options)
    }

    async create(options) {
        await Mailing.create(options)
    }

    async update(record, options) {
        await record.update(options)
    }

    async delete(record) {
        await record.destroy()
    }
}

module.exports = {
    mailingService: new MailingService()
}