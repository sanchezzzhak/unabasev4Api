
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const mConfig = require('../../config/main');

module.exports = {
  login(req, res){		
    User.findOne({ 'username' :  req.body.username }, function(err, user) {
      // if there are any errors, return the error before anything else
      if (err){
        throw err
      }

      // if no user is found, return the message
      if (!user){
        console.log('User does not exist');
        res.statusMessage = "User does not exist";
        res.status(404).end();

        res.send('User does not exist');
      }else if (!user.validPassword(req.body.password)){
        console.log("Current password does not match");
        
        res.statusMessage = "Current password does not match";
        res.status(403).end();

        res.send('Current password does not match');
        // return done(null, false, 'wrong pass123sg'); // create the loginMessage and save it to session as flashdata
      }else if(!user.isActive){
        console.log("User is not active");
        res.statusMessage = "User is not active";
        res.status(401).end();

        res.send('User is not active');
      }else{
  
        // all is well, return successful user
        user.lastLogin = Date.now()
        if(user.activeScope == '' || !user.activeScope || user.activeScope == null){
          user.activeScope = user._id;
        }
        user.save((err, user)=>{
          const token = jwt.sign({ user: user.getUser() }, mConfig.secret )
          res.json({
            message: 'User Authenticated',
            token
          })
        });

      }

    });
  },
  signup(req, res){

    User.findOne({ 'username' :  req.body.username }, function(err, user) {
      // if there are any errors, return the error
      if (err)
        throw err

      // check to see if theres already a user with that email
      if (user) {
        // return done(null, false, req.flash('signupMessage', 'El nombre de usuario ya fue elegido.'));
        res.statusMessage = "Username already exist";
        res.status(200).end();
        res.send({
          msg: 'Username already exist'
        })
      } else {

        // if there is no user with that email
        // create the user
        var newUser = new User();

        // set the user's local credentials
        newUser.username    = req.body.username;
        newUser.password = newUser.generateHash(req.body.password);
        newUser.isActive = true;
        newUser.name = req.body.name;
        newUser.rut = req.body.rut;
        newUser.phone = req.body.phone;
        newUser.cellphone = req.body.cellphone;
        newUser.email = req.body.email;
        newUser.address = req.body.address;

        // save the user
        newUser.save(function(err, user) {
          if (err)
            throw err;

          user.activeScope = user._id;
          user.save();
          res.send({
            user
          })
        });
      }

    });    
  },

}