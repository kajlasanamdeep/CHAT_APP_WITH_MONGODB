const joi = require('joi');

module.exports.userLoginSchema = {

    body: joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
    })
    
};