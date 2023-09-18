import { Router } from 'express';
import { profile } from './profile';
import { update } from './update';
import { changePassword } from './changePassword';

export const profileRouter = Router();

profileRouter.get('/', profile);

profileRouter.post('/', update());

profileRouter.post('/change-password', changePassword);

profileRouter.put('/', update());

profileRouter.patch('/', update(true));
