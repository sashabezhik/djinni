const { CronService } = require('../cron/cron.service')
const { ParseCandidatesFacade } = require('./parseCandidatesFacade.service')
const { mailingInfoService } = require('../mailing/mailingInfo.service')
const { cryptoService } = require('../crypto/crypto.service')

class ActiveParsersService {
    _cronService
    _parseFunc
    _activeParsers
    _statusHandlers

    constructor() {
        this._cronService = new CronService()
        this._activeParsers = []

        this._parseFunc = async (
            { email, password, loginUrl, filterUrl, message },
            firstParse = false
        ) => {
            try {
                const parseCandidateFacade = new ParseCandidatesFacade()
                this._activeParsers.push({ filterUrl, parser: parseCandidateFacade })

                await parseCandidateFacade.init()
                await parseCandidateFacade.parseCandidatesAndSendLetters({
                    loginInfo: { email, password, loginUrl },
                    filterUrl,
                    message,
                    firstParse
                })
            } catch (err) {
                console.log(err.message)
            } finally {
                this.removeParserByUrl(filterUrl)
            }
        }

        this._statusHandlers = {
            'start': async (filterUrl) => {
                await mailingInfoService.findMailingAndUpdateStatus(filterUrl, 'active')
                this._cronService.startTask(filterUrl)
            },
            'pause': async (filterUrl) => {
                await mailingInfoService.findMailingAndUpdateStatus(filterUrl, 'paused')
                this._cronService.pauseTask(filterUrl)

                const activeParser = this.findParserByUrl(filterUrl)
                if (activeParser) await activeParser.parser._selenium.quit()
            },
            'delete': async (filterUrl) => {
                await mailingInfoService.deleteMailing(filterUrl)
                this._cronService.deleteTask(filterUrl)

                const activeParser = this.findParserByUrl(filterUrl)
                if (activeParser) await activeParser.parser._selenium.quit()
            }
        }
    }

    async createParser(cronString, parserInfo) {
        try {
            const { filterUrl } = parserInfo

            await this._parseFunc(parserInfo, true)

            const mailingExists = await mailingInfoService.checkIfMailingExists(filterUrl)
            if (!mailingExists) return

            await mailingInfoService.findMailingAndUpdateStatus(filterUrl, 'active')
            
            this._cronService.addTask(
                cronString, 
                filterUrl, 
                () => this._parseFunc(parserInfo)
            )
        } catch (err) {
            console.log(err.message)
        }
    }

    async updateParser(cronString, parserInfo) {
        try {
            const { filterUrl, oldFilterUrl, oldStatus, status } = parserInfo

            if (status === 'loading') {
                await this._parseFunc(parserInfo, true)

                const mailingExists = await mailingInfoService.checkIfMailingExists(filterUrl)
                if (!mailingExists) return this._cronService.deleteTask(oldFilterUrl)

                await mailingInfoService.findMailingAndUpdateStatus(filterUrl, oldStatus)
            }

            this._cronService.updateTask(
                cronString, 
                { filterUrl, oldFilterUrl, status: oldStatus },
                () => this._parseFunc(parserInfo)
            )
        } catch (err) {
            console.log(err.message)
        }
    }

    async updateParserStatus({ filterUrl, status }) {
        try {
            const handler = this._statusHandlers[status]
            await handler(filterUrl)
        } catch (err) {
            console.log(err.message)
        }
    }

    async restoreParsersFromDb(cronString, loginUrl) {
        try {
            const mailings = await mailingInfoService.findAllMailings()

            for (const mailing of mailings) {
                if (mailing.status === 'loading') {
                    await mailingInfoService.deleteMailing(mailing.url)
                    continue
                }

                const { email, password: hashedPassword } = await mailingInfoService.getMailingUser(mailing)
                const password = cryptoService.decrypt(hashedPassword).toString()

                const { url: filterUrl, message, status } = mailing

                this._cronService.restoreTask(
                    cronString,
                    { filterUrl, status},
                    () => this._parseFunc({ email, password, loginUrl, filterUrl, message })
                )
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    findParserByUrl(url) {
        return this._activeParsers.find(parser => parser.filterUrl === url)
    }

    removeParserByUrl(url) {
        this._activeParsers = this._activeParsers.filter(parser => parser.filterUrl !== url)
    }
}

module.exports = {
    ActiveParsersService
}