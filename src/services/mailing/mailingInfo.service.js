const { mailingService } = require('./mailing.service')

class MailingInfoService {
    async createMailing(options) {
        await mailingService.create(options)
    }

    async updateMailing({ name, filterUrl, oldFilterUrl, message, status }) {
        const mailing = await mailingService.findOne({ where: {
            url: oldFilterUrl
        }})

        await mailingService.update(mailing, { 
            name, 
            url: filterUrl,
            message,
            status
        })
    }

    async findMailingAndUpdateStatus(url, status) {
        const mailing = await mailingService.findOne({ where: {
            url
        }})

        await mailingService.update(mailing, { status })
    }

    async checkIfUrlUnique(id, url) {
        const mailings = await mailingService.findAll({ where: {
            url
        }})
        const otherMailings = mailings.filter(mailing => mailing.id !== id)

        return otherMailings.length < 1
    }

    async checkIfMailingExists(url) {
        return await mailingService.findOne({ where: {
            url
        }})
    }

    async deleteMailing(url) {
        const mailingExists = await this.checkIfMailingExists(url)
        
        if (mailingExists) await mailingService.delete(mailingExists)
    }

    async findAllMailings() {
        return await mailingService.findAll()
    }

    async getMailingUser(mailing) {
        return await mailing.getUser()
    }
}

module.exports = {
    mailingInfoService: new MailingInfoService()
}