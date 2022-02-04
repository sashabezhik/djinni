const Joi = require('joi')
const { Validator } = require('./Validator')

class UserLoginValidator extends Validator {
    constructor() {
        const schema = Joi.object({
            email: Joi
                .string()
                .email()
                .required(),
            password: Joi
                .string()
                .required()
        })

        super(schema)
    }
}

module.exports = {
    userLoginValidator: new UserLoginValidator()
}