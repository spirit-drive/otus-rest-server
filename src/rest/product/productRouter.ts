import { Router } from 'express';
import { update } from './update';
import { getMany } from './getMany';
import { get } from './get';
import { create } from './create';
import { remove } from './remove';

export const productRouter = Router();

productRouter.get('/', getMany);

productRouter.post('/', create);

productRouter.delete('/:id', remove);

productRouter.get('/:id', get);

productRouter.put('/:id', update());

productRouter.patch('/:id', update(true));
