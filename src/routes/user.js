import { Router } from 'express';
const users = Router();

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
  restart,
  relationsFind
} from '../controllers/user';

import auth from '../config/lib/auth';
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
users.get('/relations/:q', relationsFind);
users.get('/:id', getOne);
users.put('/:id', update);
users.put('/password/:id', password);
users.post('/restart/:q', restart);
users.put('/business/:id', business);
users.put('/user/:id', user);
users.put('/scope/:id', scope);

export default users;
