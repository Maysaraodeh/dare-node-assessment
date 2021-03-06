import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import httpResponse from '../helpers/httpResponse';
import { findUserById } from '../services/users';
import { userRolesEnums } from './enum/users';

const { JWT_ENCRYPTION } = process.env;
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_ENCRYPTION,
};

const unAuthorizedErrorMessage = 'UnAuthorized.';

passport.use(
  'jwt',
  new Strategy(opts, async (jwtPayload, callback) => {
    try {
      const user = await findUserById(jwtPayload.user);
      callback(null, user);
    } catch (error) {
      callback(error);
    }
  })
);

const authenticate = (request, response, callback, next) => {
  passport.authenticate(
    'jwt',
    {
      session: false,
    },
    async (error, user) => {
      if (error) return httpResponse.internalServerError(next, error);
      if (user) {
        request.user = user;
        request.role = user.role;
        return callback(user);
      }
      return httpResponse.unAuthorized(response, unAuthorizedErrorMessage);
    }
  )(request, response, next);
};

export const isAuthorized = (request, response, next) => {
  authenticate(
    request,
    response,
    () => {
      next();
    },
    next
  );
};

export const isAdmin = (request, response, next) => {
  authenticate(
    request,
    response,
    () => {
      if (request.user.role === userRolesEnums[userRolesEnums.admin]) {
        return next();
      }
      return httpResponse.unAuthorized(response, unAuthorizedErrorMessage);
    },
    next
  );
};
