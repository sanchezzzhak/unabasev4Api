import {
  Router
} from 'express';
const business = Router();
import {
  get,
  gets,
  create,
  getOne,
  updateOne,
  user,
  addUserToBusiness
} from '../controllers/business';
import auth from '../config/lib/auth';

business.use(auth.sToken);
business.get('/', get);
business.post('/create', create);
business.get('/:id', getOne);
business.put('/:id', updateOne);
business.put('/user/:id', user);

// HECTOR - RUTA QUE AGREGA UN USUARIO A UNA EMPRESA
business.put('/addUser/:id', addUserToBusiness);
// business

export default business;