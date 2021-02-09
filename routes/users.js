import express from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import validate from '../middlewares/validate';
import { userController as userLogin } from '../controllers';
import { usersValidation as loginValidation } from '../validators/index';

const usersRouter = express.Router();

usersRouter.route('/login').post(validate(loginValidation), asyncHandler(userLogin));

export default usersRouter;
