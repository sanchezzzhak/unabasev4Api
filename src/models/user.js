let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let Schema = mongoose.Schema;

let mongoosePaginate = require('mongoose-paginate');
let taskModel = require('../models/task');
let Task = taskModel['task'];
let Subtask = taskModel['subtask'];
let Tag = taskModel['tag'];
// var uniqueValidator = require('mongoose-unique-validator');
// user schema
//   id, active, login, clave, nombre, apellidos, cargo, rut, telefono fijo, celular, empresa, grupo, email, direccion, perfil
// @ts-ignore
let userSchema = Schema({
	isActive: {type: Boolean, default: true},
	name: String,
	username: {type: String},
	password: String,
	rut: {type: String},
	phone:String,
	cellphone:String,
	email: {type: String},
	accountType: { type: String, default: 'personal'},
	activeScope: { type: Schema.Types.ObjectId, ref: 'User'},
	relations: {
		// invites: Array({ type: Schema.Types.ObjectId, ref: 'User'}),
		related: Array({ type: Schema.Types.ObjectId, ref: 'User'}),
		invites: Array({ type: String })
	},
	address:{
		street: String,
		number: Number,
		town: String, // deprecated
		district: String,
		city: String,
		region: String
	},
	last_login: Date,
	lastLogin: Date,
	companies: Array({ type: String }),
	access: Array({type: Object}),
	google: {
		id: String,
		name: String,
		email: String,
		accessToken: String,
		imgUrl: String,
	},
	notifications: {
		internal:{
			task:{
				changeResponsable: { type: Boolean, default: true}
			}
		},
		email: {
			task:{
				newTask: { type: Boolean, default: true}
			}
		}
	},
	history:{
		emailUrl: { type: String },
		inviteUrl: { type: String }
	},
	guests: Array({ type: String }),
	config: {
		tasks:{
			timing: {type: Boolean, default: false},
			timingTask: { type: Schema.Types.ObjectId, ref: 'Task'}
		}
	},
	timer: {
		timing: {type: Boolean, default: false},
		task: { type: Schema.Types.ObjectId, ref: 'Task'}
	}

}, {timestamps: true});

userSchema.plugin(mongoosePaginate);

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	console.log(password)
	console.log(this.password)
    return bcrypt.compareSync(password, this.password);
};


let User = module.exports = mongoose.model('User', userSchema);

User.addUser = (user, callback) => {
	// User.create(user, callback);
	user.nopassword = user.password;
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(user.password, salt, function(err, hash) {
	    	user.password = hash;
	        // user.save(callback);
	        User.create(user, callback);
	    });
	});
}

// User.setRelation = (invite, guest, callback) => {
// 	let update
// 	update = { $set: { 'relations.related': guest }}
// 	User.findOneAndUpdate({_id: invite}, update, { new: true })
// 	.exec((err, user) => { 
// 		if(err) return log(err)
// 		log(`set related ${user.name}`)
// 	})
// 	update = { $set: { 'relations.related': invite }}
// 	User.findOneAndUpdate({_id: guest}, update, { new: true })
// 	.exec((err, user) => { 
// 		if(err) return log(err)
// 		log(`set related ${user.name}`)
// 	})
// 	callback()
// }


User.getUsers = (callback, limit) => {
	User.find(callback).limit(limit);
}

User.updateUser = (id, user, options, callback) => {
	var query = {_id: id};
	// console.log(user.address);
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(user.password, salt, function(err, hash) {
	    	user.password = hash;
		var update = {
			active: user.active,
			name: user.name,
			username: user.username,
			// apellido: user.apellido,
			password: user.password,
			rut: user.rut,
			phone: user.phone,
			cellphone: user.cellphone,
			email: user.email,
			address: user.address,

			updated: Date.now()
			// empresa: user.empresa,
		}
		User.findOneAndUpdate(query, update, options, callback);
	    });
	});
}


User.updateEmpresa = (username, nuevaEmpresa, options, callback) => {
	// console.log("new empresa: "+login);
	var query = {username: username};
	var update = {
		$addToSet: {
			empresa: nuevaEmpresa
		},

	}

	User.findOne(query, function(err, user){
		var results = user.empresa.find(function(item) { return item.empresaId == nuevaEmpresa.empresaId } );
		if(typeof results == "undefined"){
			User.findOneAndUpdate(query, update, {upsert: true}, callback);

		}
	});
}

User.removeEmpresa = (id, empresaId, options, callback) => {
	console.log("user3: "+id);
	console.log("empresa3: "+empresaId);
	var query = {_id:id};
	var update = {
		$pull: {
			empresa: empresaId
		}
	}
	User.findOneAndUpdate(query, update, options, callback);
	// User.find(query).pull({empresa: empresaId});
}

User.getUserByLogin = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}
User.getUserByEmail = function(email, callback){
	var query = {email: email};
	User.findOne(query, callback);
}
User.comparePassword = function(candidatePassword, hash, callback ){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err){
    		throw err;	
    	} 
    	callback(null, isMatch);
	});
}



User.getUserById = function(id, callback){
	User.findById(id, callback);
}

User.passwordChange = function(id, oldPassword, password, callback){
	console.log("dentro de passwordChange");
	console.log(id);
	console.log(oldPassword);
	console.log(password);

	User.findById(id, function(err,user){
		User.comparePassword(oldPassword, user.password, function(err, isMatch){
	    	if(err){
	    		throw err;	
	    	} 
	    	if(isMatch){
	    		bcrypt.genSalt(10, function(err, salt) {
				    bcrypt.hash(password, salt, function(err, hash) {
				        user.password = hash;
				        user.save();
				    });
				});
	  			return callback(null, user);

	    	}else{
	  			return callback(null, false, {message: "password incorrecta"});

	    	}
		});

	});

}
