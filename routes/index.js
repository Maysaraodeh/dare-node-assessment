import express from 'express';
import usersRoutes from './users';

export const router = express.Router();

router.use('/', usersRoutes);
