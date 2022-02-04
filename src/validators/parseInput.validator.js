const Joi = require('joi')
const { Validator } = require('./Validator')

class ParseInputValidator extends Validator {
    constructor() {
        const schema = Joi.object({
            name: Joi
                .string()
                .required(),
            filterUrl: Joi
                .string()
                .required(),
            message: Joi
                .string()
                .required()
        })

        super(schema)
    }
}

module.exports = {
    parseInputValidator: new ParseInputValidator()
}