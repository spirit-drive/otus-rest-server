import { Router } from 'express';
import { update } from './update';
import { getMany } from './getMany';
import { get } from './get';
import { create } from './create';
import { remove } from './remove';

export const orderRouter = Router();

orderRouter.get('/', getMany);

orderRouter.post('/', create);

orderRouter.delete('/:id', remove);

orderRouter.get('/:id', get);

orderRouter.put('/:id', update());

orderRouter.patch('/:id', update(true));
