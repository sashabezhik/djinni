const Joi = require('joi')
const { Validator } = require('./Validator')

class MailingStatusValidator extends Validator {
    constructor() {
        const schema = Joi.object({
            filterUrl: Joi
                .string()
                .required(),
            status: Joi
                .string()
                .valid('start', 'pause', 'delete')
                .required()
        })

        super(schema)
    }
}

module.exports = {
    mailingStatusValidator: new MailingStatusValidator()
}