class Validator {
    constructor(schema) {
        this.schema = schema
    }

    validate(req, res, next) {
        const { error } = this.schema.validate(req.body)

        if (error) return res.status(400).json({ message: error.details[0].message  })

        next()
    }
}

module.exports = {
    Validator
}