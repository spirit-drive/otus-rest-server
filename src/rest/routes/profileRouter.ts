import { Router } from 'express';
import { profile } from '../profile/profile';
import { update } from '../profile/update';
import { changePassword } from '../profile/changePassword';

export const profileRouter = Router();

profileRouter.get('/', profile);

profileRouter.post('/', update());

profileRouter.post('/change-password', changePassword);

profileRouter.put('/', update());

profileRouter.patch('/', update(true));
