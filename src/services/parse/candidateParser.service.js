const { usedHrefService } = require('../usedHref/usedHref.service')

class CandidateParserService {
    _selenium
    _candidateHrefs

    constructor(selenium) {
        this._selenium = selenium
        this._candidateHrefs = []
    }

    async parseCandidateHrefsByUrl(url) {
        try {
            await this._selenium.openPageByUrl(url)

            const anchors = await this._selenium.findElementsBy('css', 'a.profile')

            this._candidateHrefs = await Promise.all(
                anchors.map(async (anchor) => await this._selenium.getElementAttribute(anchor, 'href'))
            )

            await this.removeUsedHrefs()

            return this._candidateHrefs
        } catch (err) {
            console.log(`Parse hrefs error: ${err.message}`)
        }
    }

    async removeUsedHrefs() {
        const unusedHrefs = []

        for (const href of this._candidateHrefs) {
            const hrefExists = await usedHrefService.findOne({ where: {
                url: href
            }})

            if (!hrefExists) unusedHrefs.push(href)
        }

        this._candidateHrefs = [...unusedHrefs]
    }
}

module.exports = {
    CandidateParserService
}