import joi from '@hapi/joi';
import httpResponse from '../helpers/httpResponse';

const validate = (validateCheck) => (req, res, next) => {
  const expectedKeys = Object.keys(validateCheck);
  const objectValidate = expectedKeys.reduce((accum, curr) => {
    const acc = accum;
    acc[curr] = req[curr];
    return acc;
  }, {});
  const validateStatus = joi.validate(objectValidate, validateCheck);
  if (validateStatus.error)
    httpResponse.badRequest(res, validateStatus.error.details[0].message.replace(/"/g, ''));
  else next();
};

export default validate;
