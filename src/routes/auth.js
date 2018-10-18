import axios from 'axios';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import gauth from '../config/auth';
import mainConfig from '../config/main';
import ctl from '../controllers/auth';
import User from '../models/user';
const auth = Router();
/*
{
	get--/ list of  
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/
auth.post('/register', ctl.register);

// auth.get('/errUser', ctl.errUser);

auth.post('/login', ctl.login);

// auth.post('/google/register', ctl.google.register);
auth.post('/google', ctl.google);
export default auth;
