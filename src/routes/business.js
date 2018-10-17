import { Router } from 'express';
const business = Router();
import {
  get,
  gets,
  create,
  getOne,
  update,
  user
} from '../controllers/business';
import auth from '../config/lib/auth';
business.use(auth.sToken);

business.get('/', get);
business.post('/', gets);
business.post('/create', create);
business.get('/:_id', getOne);
business.put('/:_id', update);

business.put('/user/:id', user);
// business

export default business;
