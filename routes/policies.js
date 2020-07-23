import express from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate } from '../middlewares/validate';
import { isAuthorized } from '../middlewares/auth';
import { policiesValidation } from '../validators';
import { policiesController } from '../controllers';
const policiesRouter = express.Router();

policiesRouter
  .route('/')
  .get(
    isAuthorized,
    validate(policiesValidation.getPoliciesValidation),
    asyncHandler(policiesController.getPolicies)
  );
policiesRouter
  .route('/:id')
  .get(
    isAuthorized,
    validate(policiesValidation.getPolicyValidation),
    asyncHandler(policiesController.getPolicy)
  );

export default policiesRouter;
