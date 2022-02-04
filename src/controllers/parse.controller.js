const { ActiveParsersService } = require('../services/parse/activeParsers.service')
const { mailingInfoService } = require('../services/mailing/mailingInfo.service')
const { userInfoService } = require('../services/user/userInfo.service')
const { cryptoService } = require('../services/crypto/crypto.service')

class ParseController {
    _activeParsersService
    _loginUrl
    _cronString

    constructor() {
        this._activeParsersService = new ActiveParsersService()
    }

    init() {
        this._loginUrl = process.env.SITE_LOGIN_URL
        this._cronString = process.env.CRON_VALUE

        cryptoService.init()
    }

    async parseCandidates(req, res) {
        try {
            const { name, filterUrl, message } = req.body
            const userId = req.userId
            
            const mailingExists = await mailingInfoService.checkIfMailingExists(filterUrl)
            if (mailingExists) return res.status(400).json({ message: 'Mailing already exists' })

            const user = await userInfoService.findUserById(userId)
            if (!user) return res.status(400).json({ message: 'User not found' })
            
            const { email, password: hashedPassword } = user
            const password = cryptoService.decrypt(hashedPassword).toString()

            await mailingInfoService.createMailing({
                name,
                message,
                userId,
                url: filterUrl,
                status: 'loading'
            })

            await this._activeParsersService.createParser(this._cronString, {
                email,
                password,
                loginUrl: this._loginUrl,
                name,
                filterUrl,
                message,
                userId
            })

            return res.json({ message: 'Mailing created' })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    async updateMailing(req, res) {
        try {
            const { name, filterUrl, oldFilterUrl, message } = req.body
            const userId = req.userId
                
            const mailingExists = await mailingInfoService.checkIfMailingExists(oldFilterUrl)
            if (!mailingExists) return res.status(400).json({ message: 'Mailing was not found' })

            const mailingIsUnique = await mailingInfoService.checkIfUrlUnique(mailingExists.id, filterUrl)
            if (!mailingIsUnique) return res.status(400).json({ message: `Mailing with url: ${filterUrl} already exists` })
    
            const user = await userInfoService.findUserById(userId)
            if (!user) return res.status(400).json({ message: 'User not found' })
    
            const { email, password: hashedPassword } = user
            const password = cryptoService.decrypt(hashedPassword).toString()

            const mailingStatus = filterUrl === oldFilterUrl ? mailingExists.status : 'loading'

            await mailingInfoService.updateMailing({
                name, 
                filterUrl, 
                oldFilterUrl, 
                message,
                status: mailingStatus
            })

            await this._activeParsersService.updateParser(this._cronString, {
                email,
                password,
                loginUrl: this._loginUrl,
                oldStatus: mailingExists.status,
                status: mailingStatus,
                filterUrl,
                oldFilterUrl,
                message
            })

            return res.status(200).json({ message: 'Mailing updated' })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    async changeMailingStatus(req, res) {
        try {
            const { filterUrl, status } = req.body
            
            await this._activeParsersService.updateParserStatus({ filterUrl, status })

            return res.status(200).json({ message: `Mailing status changed to ${status}` })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }
}

module.exports = {
    parseController: new ParseController()
}