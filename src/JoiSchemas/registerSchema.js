import Joi from "joi";

const registerSchema = Joi.object({
    amount: Joi.number().required(),
    description: Joi.string().required(),
    type: Joi.string().required().valid("income", "outcome")
})

export default registerSchema;