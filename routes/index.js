import express from 'express';
import usersRoutes from './users';
import policiesRoutes from './policies';
export const router = express.Router();

router.use('/', usersRoutes);
router.use('/policies', policiesRoutes);
