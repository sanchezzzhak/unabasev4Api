import { Router } from 'express';
const currencies = Router();

import { body } from 'express-validator/check';
import {
  get,
  create,
  update,
  findOne,
  getOne,
  validate
} from '../controllers/currency';
currencies.get('/', get);
currencies.post('/', create);
currencies.put('/:id', update);
// currencies.get('/find', findOne);
// currencies.get(':id', getOne);

export default currencies;
