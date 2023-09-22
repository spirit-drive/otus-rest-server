import { Router } from 'express';
import { UploadedFile } from 'express-fileupload';
import * as path from 'path';
import * as fs from 'fs';
export const uploadRouter = Router();

export const assetsPath = path.join(process.cwd(), 'src', 'assets');

uploadRouter.post('/upload', function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({ message: 'No files were uploaded.' });
  }

  const file = req.files.file as UploadedFile;
  const name = encodeURI(file.name);
  if (!fs.existsSync(assetsPath)) fs.mkdirSync(assetsPath);

  const uploadPath = path.join(assetsPath, name);

  file.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);
    res.send({ url: `/img/${name}` });
  });
});
