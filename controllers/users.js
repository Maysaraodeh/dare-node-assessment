import httpResponse from '../helpers/httpResponse';
import { property } from '../helpers/propertiesReader';
import { findUserByEmail, compareUserPassword } from '../services/users';
import { getJWT } from '../services/auth';
import _ from 'lodash';

export const login = async (req, res) => {
  const {
    body: { email, password },
  } = req;
  const user = await findUserByEmail(email);
  if (!user || _.isEmpty(user, true))
    return httpResponse.notFound(res, property('user.notFound'));
  if (!compareUserPassword(user, password))
    return httpResponse.badRequest(res, property('authentication.failed'));
  const result = getJWT(user);
  return httpResponse.ok(res, result, '', true);
};
