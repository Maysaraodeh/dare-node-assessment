import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '../config';
import httpResponse from '../helpers/httpResponse';
import { findUserByEmail } from '../services/users';
import { userRolesEnums } from './enum/users';

const { JWT_ENCRYPTION } = config;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_ENCRYPTION,
};

const unAuthorizedErrorMessage = 'UnAuthorized.';

passport.use(
  'jwt',
  new Strategy(opts, async (jwtPayload, callback) => {
    try {
      const user = await findUserByEmail(jwtPayload.user.email);

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
        callback(user);
      } else {
        return httpResponse.unAuthorized(response, unAuthorizedErrorMessage);
      }
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
      if (request.user.role === userRolesEnums[userRolesEnums.admin])
        return next();
      httpResponse.unAuthorized(response, unAuthorizedErrorMessage);
    },
    next
  );
};
