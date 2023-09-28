import { Router } from 'express';
import { update } from './update';
import { getMany } from './getMany';
import { get } from './get';
import { create } from './create';
import { remove } from './remove';

export const orderRouter = Router();
export const protectedOrderRouter = Router();

orderRouter.get('/', getMany);

protectedOrderRouter.post('/', create);

protectedOrderRouter.delete('/:id', remove);

orderRouter.get('/:id', get);

protectedOrderRouter.put('/:id', update());

protectedOrderRouter.patch('/:id', update(true));
