const { SeleniumService } = require('../selenium/selenium.service')
const { LoginService } = require('./login.service')
const { CandidateParserService } = require('./candidateParser.service')
const { MessageSenderService } = require('./messageSender.service')

class ParseCandidatesFacade {
    async init() {
        this._selenium = new SeleniumService()
        await this._selenium.init()

        this._loginner = new LoginService(this._selenium)
        this._candidateParser = new CandidateParserService(this._selenium)
        this._messageSender = new MessageSenderService(this._selenium)
    }

    async parseCandidatesAndSendLetters({
        loginInfo,
        filterUrl,
        message,
        firstParse
    }) {
        try {
            await this._loginner.logInWithCredentials(loginInfo)

            const candidateLinks = await this._candidateParser.parseCandidateHrefsByUrl(filterUrl)
            
            await this._messageSender.sendMessageToCandidates({ 
                candidateLinks,
                message, 
                firstParse
            })
        } catch (err) {
            throw err
        } finally {
            await this._selenium.quit()
        }
    }
}

module.exports = { 
    ParseCandidatesFacade 
}