import { Router } from 'express';
import { signup } from '../auth/signup';
import { signin } from '../auth/signin';

export const authRouter = Router();

authRouter.post('/signup', signup);

authRouter.post('/signin', signin);

authRouter.get('/hello', (_, res) => {
  res.send('hello');
});
