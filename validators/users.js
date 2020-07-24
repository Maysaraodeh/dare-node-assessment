import joi from '@hapi/joi';
const validUsernameRegex = /^[a-z0-9_-]{3,16}$/;
export const loginValidation = {
  body: {
    username: joi.string().required().regex(validUsernameRegex),
    password: joi.string().min(6).required(),
  },
};
