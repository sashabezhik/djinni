const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const { sequelize } = require('./database/models/')

const { parseController } = require('./controllers/parse.controller')
const { userController } = require('./controllers/user.controller')
const { userLoginValidator } = require('./validators/userLogin.validator')
const { userTokenValidator } = require('./validators/userToken.validator')
const { parseInputValidator } = require('./validators/parseInput.validator')
const { mailingStatusValidator } = require('./validators/mailingStatus.validator')
const { updateMailingValidator } = require('./validators/updateMailing.validator')

class Server {
    constructor() {
        this.init()
    }

    init() {
        dotenv.config()

        this.app = express()
        this.port = process.env.PORT || 5000

        this.initMiddlwares()
        this.initControllers()
        this.initRoutes()
    }

    initMiddlwares() {
        this.app.use(cors())
        this.app.use(express.json({ extended: true }))
        this.app.use('/', express.static(path.join(__dirname, '../client/build')))
    }

    initControllers() {
        parseController.init()
        userController.init()
    }

    initRoutes() {
        this.app.post(
            '/auth/login',
            (req, res, next) => userLoginValidator.validate(req, res, next),
            (req, res) => userController.logIn(req, res)
        )

        this.app.post(
            '/parse/candidates', 
            [
                (req, res, next) => parseInputValidator.validate(req, res, next),
                (req, res, next) => userTokenValidator.verifyToken(req, res, next)
            ], 
            (req, res) => parseController.parseCandidates(req, res)
        )

        this.app.get(
            '/user/info',
            (req, res, next) => userTokenValidator.verifyToken(req, res, next),
            (req, res) => userController.getUserInfo(req, res)
        )

        this.app.patch(
            '/user/mailing',
            [
                (req, res, next) => updateMailingValidator.validate(req, res, next),
                (req, res, next) => userTokenValidator.verifyToken(req, res, next)
            ],
            (req, res) => parseController.updateMailing(req, res)
        )

        this.app.post(
            '/user/mailing',
            [
                (req, res, next) => mailingStatusValidator.validate(req, res, next),
                (req, res, next) => userTokenValidator.verifyToken(req, res, next)
            ],
            (req, res) => parseController.changeMailingStatus(req, res)
        )

        this.app.get(
            '/user/mailings',
            (req, res, next) => userTokenValidator.verifyToken(req, res, next),
            (req, res) => userController.getActiveMailings(req, res)
        )

        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../client/build', 'index.html'))
        })
    }

    async start() {
        try {
            await sequelize.authenticate() 
            console.log('Connected to DB')

            this.app.listen(this.port, async () => {
                console.log(`Server is listening on port: ${this.port}`)
                
                await parseController._activeParsersService.restoreParsersFromDb(
                    parseController._cronString,
                    parseController._loginUrl
                )
            })
        } catch (err) {
            console.log(`Error while starting the server: ${err.message}`)
            process.exit(1)
        }
    }
}

module.exports = {
    server: new Server()
}