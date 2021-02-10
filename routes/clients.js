import express from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import validate from '../middlewares/validate';
import { isAuthorized } from '../middlewares/auth';
import { clientsValidation } from '../validators';
import { clientsController } from '../controllers';

const clientsRouter = express.Router();

clientsRouter
  .route('/')
  .get(
    isAuthorized,
    validate(clientsValidation.getClientsValidation),
    asyncHandler(clientsController.getClients)
  );

clientsRouter
  .route('/:id')
  .get(
    isAuthorized,
    validate(clientsValidation.getClientValidation),
    asyncHandler(clientsController.getClient)
  );

clientsRouter
  .route('/:id/policies')
  .get(
    isAuthorized,
    validate(clientsValidation.getClientValidation),
    asyncHandler(clientsController.getClientPolicies)
  );

export default clientsRouter;
