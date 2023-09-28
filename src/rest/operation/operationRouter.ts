import { Router } from 'express';
import { update } from './update';
import { getMany } from './getMany';
import { get } from './get';
import { create } from './create';
import { remove } from './remove';

export const operationRouter = Router();
export const protectedOperationRouter = Router();

operationRouter.get('/', getMany);

protectedOperationRouter.post('/', create);

protectedOperationRouter.delete('/:id', remove);

operationRouter.get('/:id', get);

protectedOperationRouter.put('/:id', update());

protectedOperationRouter.patch('/:id', update(true));
