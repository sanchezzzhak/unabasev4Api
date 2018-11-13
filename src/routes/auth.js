import axios from 'axios';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import gauth from '../config/auth';
import ctl from '../controllers/auth';
import User from '../models/user';
import logger from '../lib/logger';
const auth = Router();
let module = 'auth';
/*
{
	get--/ list of  
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/
auth.put(
  '/verify/:id',
  logger({
    name: 'verify',
    description: 'verify a user with local strategy',
    module
  }),
  ctl.verify
);

auth.post(
  '/register',
  logger({
    name: 'register',
    description: 'register a user with local strategy',
    module
  }),
  ctl.register
);

auth.post(
  '/password/:id',
  logger({
    name: 'restart password',
    description: 'restart a password',
    module
  }),
  ctl.password
);

// auth.get('/errUser', ctl.errUser);

auth.post(
  '/login',
  logger({
    name: 'login',
    description: 'login a user with local strategy',
    module
  }),
  ctl.login
);

// auth.post('/google/register', ctl.google.register);
auth.post('/google', ctl.google);
export default auth;
