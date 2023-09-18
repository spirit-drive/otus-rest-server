import { Express } from 'express';
import { signup } from './auth/signup';
import { signin } from './auth/signin';
import { profile } from './profile/profile';
import { update } from './profile/update';
import { authentication } from './authentication';

export const setRoutes = (app: Express) => {
  app.get('/api/hello', (_, res) => {
    res.send('hello');
  });

  app.get('/api/profile', authentication, profile);

  app.post('/api/profile', authentication, update);

  app.post('/api/signup', signup);

  app.post('/api/signin', signin);
};
