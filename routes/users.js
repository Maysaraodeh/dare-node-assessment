import express from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate } from '../middlewares/validate';
import { userController } from '../controllers';
import { usersValidation } from '../validators/index';
const usersRouter = express.Router();

usersRouter
  .route('/login')
  .post(
    validate(usersValidation.loginValidation),
    asyncHandler(userController.login)
  );

export default usersRouter;
