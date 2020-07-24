import express from 'express';
import usersRoutes from './users';
import policiesRoutes from './policies';
import clientsRoutes from './clients';
export const router = express.Router();

router.use('/', usersRoutes);
router.use('/policies', policiesRoutes);
router.use('/clients', clientsRoutes);
