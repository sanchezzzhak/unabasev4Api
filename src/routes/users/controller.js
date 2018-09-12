
const User = require('../../models/user');

module.exports = {
  getUsers(req, res) {
    User.paginate({}, { page: 1, limit: 1000 }, (err, users) => {
      if(err){
    
      }else{
        res.send(users)
      }
    })
  },
  postUsers(req, res){
    User.paginate({}, { page: req.body.page , limit: 20 }, (err, users) => {
      if(err){
    
      }else{
        res.send(users)
      }
    })
  },
  getUser(req, res) {
    User.findOne({ id: req.body.id }, (err, user) => {
      if(err){
        console.log(err);
      }else{
        delete(user.relations)
        res.send(user);
      }
    })
  },
  updateUser(req, res) {

  },
  createUser(req, res) {

  }
}