import { Router } from 'express';
const outcomes = Router();
import { gets, getFilter, get, update } from '../../controllers/outcome';
import { cToken } from '../../config/lib/auth';
users.use(cToken);

/*
{
	get--/ list of  
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/
users.get('/', gets);
users.post('/', getFilter);
users.get('/:id', get);
users.put('/', update);

export default outcomes;
