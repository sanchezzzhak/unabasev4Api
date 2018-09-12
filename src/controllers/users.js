

const User = require('../models/user');

 const users = (req, res) => {
	User.paginate({}, { page: 1, limit: 1000 }, (err, users) => {
		if(err){
	
		}else{
			res.send(users)
		}
	})
}

module.export = {
	users
}