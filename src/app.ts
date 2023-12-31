import * as express from 'express';
import * as cors from 'cors';
import { createServer } from 'http';
import * as passport from 'passport';
import config from './db.config';
import * as mongoose from 'mongoose';
import * as fileUpload from 'express-fileupload';
import { mainRouter } from './rest/routes/mainRouter';
import * as path from 'path';
import { assetsPath } from './rest/routes/uploadRouter';

(async () => {
  const app = express();

  const httpServer = createServer(app);

  const isDev = process.env.MODE !== 'production';

  await mongoose.connect(isDev ? config.db_dev : config.db);
  Object.assign(mongoose, { Promise: global.Promise });

  const port = parseInt(process.env.PORT) || 4011;

  app.use(fileUpload());

  app.use(passport.initialize());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());

  app.get('/hello', (_, res) => res.send('hello'));
  app.use('/api', mainRouter);
  app.get('/img/*', (req, res) => {
    res.sendFile(path.join(assetsPath, ...req.path.replace('/img/', '').split('/')));
  });

  httpServer.listen(port, () => console.log(`🚀 Server ready at http://localhost:${port}`));
})();
