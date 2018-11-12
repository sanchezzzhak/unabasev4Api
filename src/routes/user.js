import { Router } from 'express';
const users = Router();
import ctl from '../controllers/user';
import {
  create,
  get,
  logout,
  find,
  getOne,
  password,
  update,
  business,
  scope,
  user,
  restartPassword
} from '../controllers/user';

import auth from '../config/lib/auth';
import restartPassword from '../lib/mails/modules/restartPassword';
users.use(auth.sToken);

/*
{
	get--/ 
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/
users.post('/', create);
users.get('/', get);
users.get('/logout', logout);
users.get('/find/:q', find);
users.get('/:id', getOne);
users.put('/:id', update);
users.put('/password/:id', password);
users.post('/restart/:q', restartPassword);
users.put('/business/:id', business);
users.put('/user/:id', user);
users.put('/scope/:id', scope);

export default users;
