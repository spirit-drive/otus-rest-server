import { Router } from 'express';
import { update } from './update';
import { getMany } from './getMany';
import { get } from './get';
import { create } from './create';
import { remove } from './remove';

export const productRouter = Router();
export const protectedProductRouter = Router();

productRouter.get('/', getMany);

protectedProductRouter.post('/', create);

protectedProductRouter.delete('/:id', remove);

productRouter.get('/:id', get);

protectedProductRouter.put('/:id', update());

protectedProductRouter.patch('/:id', update(true));
