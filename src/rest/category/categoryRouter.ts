import { Router } from 'express';
import { update } from './update';
import { getMany } from './getMany';
import { get } from './get';
import { create } from './create';
import { remove } from './remove';

export const categoryRouter = Router();
export const protectedCategoryRouter = Router();

categoryRouter.get('/', getMany);

protectedCategoryRouter.post('/', create);

protectedCategoryRouter.delete('/:id', remove);

categoryRouter.get('/:id', get);

protectedCategoryRouter.put('/:id', update());

protectedCategoryRouter.patch('/:id', update(true));
