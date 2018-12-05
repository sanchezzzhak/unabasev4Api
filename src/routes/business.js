import { Router } from 'express';
const business = Router();
import {
  get,
  gets,
  create,
  getOne,
  updateOne,
  user
} from '../controllers/business';
import auth from '../config/lib/auth';

business.use(auth.sToken);
business.get('/', get);
business.post('/create', create);
business.get('/:id', getOne);
business.put('/:id', updateOne);
business.put('/user/:id', user);
// business

export default business;
