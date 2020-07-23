import joi from '@hapi/joi';
import httpResponse from '../helpers/httpResponse';

export const validate = (validateCheck) => (req, res, next) => {
  const expectedKeys = Object.keys(validateCheck);
  const objectValidate = expectedKeys.reduce((accum, curr) => {
    accum[curr] = req[curr];
    return accum;
  }, {});
  const validateStatus = joi.validate(objectValidate, validateCheck);
  if (validateStatus.error)
    httpResponse.badRequest(
      res,
      validateStatus.error.details[0].message.replace(/"/g, '')
    );
  else next();
};
