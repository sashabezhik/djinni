const { usedHrefService } = require('../usedHref/usedHref.service')

class MessageSenderService {
    _selenium

    constructor(selenium) {
        this._selenium = selenium
    }

    async sendMessageToCandidates({ candidateLinks, message, firstParse }) {
        if (firstParse) 
            return await this.tagCandidatesAsUsed(candidateLinks)

        for (const link of candidateLinks) {
            await this._selenium.openPageByUrl(link)

            try {
                const messageTextArea = await this._selenium.findElementBy('css', '#body')
                await this._selenium.clearElementContent(messageTextArea)
                await this._selenium.sleep(1000)

                try {
                    await this._selenium.findElementBy('css', '#answer')
                } catch (err) {
                    await this._selenium.sendKeysToElement(messageTextArea, message)
                    await this._selenium.sleep(2000)

                    await this._selenium.executeScript("document.getElementById('send-btn').click()") 
                    await this._selenium.sleep(3000)

                    await usedHrefService.create({ url: link })
                }
            } catch (err) {
                await usedHrefService.create({ url: link })
            }
        }
    }

    async tagCandidatesAsUsed(candidateLinks) {
        for (const link of candidateLinks) 
            await usedHrefService.create({ url: link })
    }
}

module.exports = {
    MessageSenderService
}