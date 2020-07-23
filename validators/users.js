import joi from '@hapi/joi';

export const loginValidation = {
  body: {
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  },
};
