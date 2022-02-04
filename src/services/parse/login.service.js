class LoginService {
    _selenium

    constructor(selenium) {
        this._selenium = selenium
    }

    async logInWithCredentials({ email, password, loginUrl }) {
        try {
            await this._selenium.openPageByUrl(loginUrl)

            const emailInput = await this._selenium.findElementBy('css', 'input.form-control')
            const passwordInput = await this._selenium.findElementBy('css', 'input.form-control.ph-no-capture')
            const logInBtn = await this._selenium.findElementBy('css', '.btn.btn-primary.btn-lg')

            await this._selenium.sendKeysToElement(emailInput, email)
            await this._selenium.sendKeysToElement(passwordInput, password)
            await this._selenium.clickElement(logInBtn, 'doubleClick')

            await this.checkIfLoginSuccess()
        } catch (err) {
            console.log(`Login error: ${err.message}`)
        }
    }

    async checkIfLoginSuccess() {
        await this._selenium.sleep(2000)

        const currentUrl = await this._selenium.getCurrentUrl()
        if (currentUrl.includes('login')) throw new Error('wrong credentials')
    }
}

module.exports = {
    LoginService
}