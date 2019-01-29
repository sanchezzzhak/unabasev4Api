import mongoose from 'mongoose';

import mongoosePaginate from 'mongoose-paginate';
import bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;
const salt = bcrypt.genSaltSync(10);
let userSchema = Schema(
  {
    isActive: { type: Boolean, default: true },
    name: String,
    username: { type: String },
    language: { type: String, default: 'es' },
    // password: String,
    password: {
      hash: String,
      updatedAt: { type: Date, default: new Date() },
      isRandom: { type: Boolean, default: false },
      activateHash: String
    },
    idnumber: { type: String },
    phones: [{ _id: false, phone: String, label: String }],
    emails: [{ _id: false, email: String, label: String }],
    /**
     *     enum: ['personal', 'business']
     */
    type: {
      type: String,
      default: 'personal',
      enum: ['personal', 'business']
    },
    /**
     *  active scope, personal or one of the business asociated
     */
    scope: {
      id: { type: Schema.Types.ObjectId, ref: 'Business' },
      type: {
        type: String,
        enum: ['personal', 'business'],
        default: 'personal'
      }
    },
    address: {
      lat: String,
      long: String,
      text: String
    },
    lastLogin: Date,
    access: Array({ type: Object }),
    imgUrl: String,
    google: {
      id: String,
      name: String,
      email: String,
      accessToken: String,
      imgUrl: String
    },
    defaults: {
      tax: { type: Schema.Types.ObjectId, ref: 'Tax' }
    },
    relations: Array({
      ref: { type: Schema.Types.ObjectId, ref: 'User' },
      id: { type: String }
    }),
    contacts: Array({ type: Schema.Types.ObjectId, ref: 'Contact' }),
    notifications: {
      newUserContact: { type: Boolean, default: true }
    },
    //business info
    legalName: String, // razón social,
    businessType: Array({ type: String }), // giro
    website: String,
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    admins: Array({
      _id: false,
      description: String,
      user: { type: Schema.Types.ObjectId, ref: 'User' }
    }),

    /**
     *  array of ObjectIds from business asociated
     */
    business: Array({ type: Schema.Types.ObjectId, ref: 'User' }),
    users: Array({ type: Schema.Types.ObjectId, ref: 'User' })
  },
  { timestamps: true }
);

userSchema.plugin(mongoosePaginate);

// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, salt, null);
};

userSchema.methods.getUser = function() {
  let user = {
    _id: this._id,
    isActive: this.isActive,
    name: this.name,
    username: this.username,
    idnumber: this.idnumber,
    phones: this.phones,
    emails: this.emails,
    scope: this.scope,
    type: this.type,
    address: this.address,
    // address: {
    //   street: this.street,
    //   number: this.number,
    //   town: this.town,
    //   district: this.district,
    //   city: this.city,
    //   region: this.region,
    //   country: this.country
    // },
    lastLogin: this.lastLogin,
    imgUrl: this.imgUrl,
    google: {
      name: this.google.name,
      email: this.google.email,
      imgUrl: this.google.imgUrl
    },
    legalName: this.legalName,
    businessType: this.businessType,
    website: this.website,
    creator: this.creator,
    admins: this.admins,
    users: this.users
  };
  return user;
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  // console.log(password);
  // console.log(this.password);
  return bcrypt.compareSync(password, this.password.hash);
};

const User = mongoose.model('User', userSchema);

export default User;

User.hash = password => {
  return bcrypt.hashSync(password, salt, null);
};
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
};

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
};

User.updateUser = (id, user, options, callback) => {
  var query = { _id: id };
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
      };
      User.findOneAndUpdate(query, update, options, callback);
    });
  });
};

User.updateEmpresa = (username, nuevaEmpresa, options, callback) => {
  // console.log("new empresa: "+login);
  var query = { username: username };
  var update = {
    $addToSet: {
      empresa: nuevaEmpresa
    }
  };

  User.findOne(query, function(err, user) {
    var results = user.empresa.find(function(item) {
      return item.empresaId == nuevaEmpresa.empresaId;
    });
    if (typeof results == 'undefined') {
      User.findOneAndUpdate(query, update, { upsert: true }, callback);
    }
  });
};

User.removeEmpresa = (id, empresaId, options, callback) => {
  console.log('user3: ' + id);
  console.log('empresa3: ' + empresaId);
  var query = { _id: id };
  var update = {
    $pull: {
      empresa: empresaId
    }
  };
  User.findOneAndUpdate(query, update, options, callback);
  // User.find(query).pull({empresa: empresaId});
};

User.getUserByLogin = function(username, callback) {
  var query = { username: username };
  User.findOne(query, callback);
};
User.getUserByEmail = function(email, callback) {
  var query = { email: email };
  User.findOne(query, callback);
};
User.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) {
      throw err;
    }
    callback(null, isMatch);
  });
};

User.getUserById = function(id, callback) {
  User.findById(id, callback);
};

User.passwordChange = function(id, oldPassword, password, callback) {
  console.log('dentro de passwordChange');
  console.log(id);
  console.log(oldPassword);
  console.log(password);

  User.findById(id, function(err, user) {
    User.comparePassword(oldPassword, user.password, function(err, isMatch) {
      if (err) {
        throw err;
      }
      if (isMatch) {
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(password, salt, function(err, hash) {
            user.password = hash;
            user.save();
          });
        });
        return callback(null, user);
      } else {
        return callback(null, false, { message: 'password incorrecta' });
      }
    });
  });
};
