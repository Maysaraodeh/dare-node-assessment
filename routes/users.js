import express from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate } from '../middlewares/validate';
import { userController } from '../controllers';
import { usersValidation } from '../validators/index';
import { isAuthorized } from '../middlewares/auth';
const usersRouter = express.Router();

usersRouter
  .route('/login')
  .post(
    validate(usersValidation.loginValidation),
    asyncHandler(userController.login)
  )
  .get(
    isAuthorized,
    asyncHandler((req, res) => res.json({ success: true }))
  );

export default usersRouter;
