import { Router } from 'express';
const logs = Router();
import { get, getOne, create, find } from '../controllers/log';
import { sToken } from '../config/lib/auth';

logs.use(sToken);

logs.get('/', get);
logs.get('/:id', getOne);
logs.post('/', create);
logs.get('/find/:q', find);

export default logs;
