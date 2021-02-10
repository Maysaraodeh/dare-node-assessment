import httpResponse from '../helpers/httpResponse';
import property from '../helpers/propertiesReader';
import { findUserByName, compareUserPassword } from '../services/users';
import getJWT from '../services/auth';

const login = async (req, res) => {
  const {
    body: { username, password },
  } = req;

  const user = await findUserByName(username);

  if (!compareUserPassword(user, password)) {
    return httpResponse.badRequest(res, property('authentication.failed'));
  }
  const result = getJWT(user);
  return httpResponse.ok(res, result);
};

export default login;
