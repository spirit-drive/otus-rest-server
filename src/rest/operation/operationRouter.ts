import { Router } from 'express';
import { update } from './update';
import { getMany } from './getMany';
import { get } from './get';
import { create } from './create';
import { remove } from './remove';

export const operationRouter = Router();

operationRouter.get('/', getMany);

operationRouter.post('/', create);

operationRouter.delete('/:id', remove);

operationRouter.get('/:id', get);

operationRouter.put('/:id', update());

operationRouter.patch('/:id', update(true));
