import { Router } from 'express';
import { update } from './update';
import { getMany } from './getMany';
import { get } from './get';
import { create } from './create';
import { remove } from './remove';

export const categoryRouter = Router();

categoryRouter.get('/', getMany);

categoryRouter.post('/', create);

categoryRouter.delete('/:id', remove);

categoryRouter.get('/:id', get);

categoryRouter.put('/:id', update());

categoryRouter.patch('/:id', update(true));
