import config from '../config';
import jwt from 'jsonwebtoken';
import moment from 'moment';
const { JWT_ENCRYPTION, JWT_EXPIRATION } = config;

export const getJWT = (user) => {
  const token = jwt.sign({ user }, JWT_ENCRYPTION, {
    expiresIn: JWT_EXPIRATION,
  });

  return {
    token,
    type: 'Bearer',
    expires_in: jwt.decode(token, JWT_ENCRYPTION).exp - moment().unix(),
  };
};
