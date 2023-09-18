import * as express from 'express';
import * as cors from 'cors';
import { createServer } from 'http';
import * as passport from 'passport';
import config from './db.config';
import * as mongoose from 'mongoose';
import * as path from 'path';
import { mainRouter } from './rest/routes/mainRouter';

(async () => {
  const app = express();

  const httpServer = createServer(app);

  const isDev = process.env.MODE !== 'production';

  await mongoose.connect(isDev ? config.db_dev : config.db);
  Object.assign(mongoose, { Promise: global.Promise });

  const port = parseInt(process.env.PORT) || 4011;

  app.use(passport.initialize());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());

  app.use('/api', mainRouter);

  const root = path.join(process.cwd(), 'dist');
  app.use(express.static(root));
  app.get('*', (_, res) => res.sendFile('index.html', { root }));

  httpServer.listen(port, () => console.log(`🚀 Server ready at http://localhost:${port}`));
})();
