let mongoose = require('mongoose');

let Schema = mongoose.Schema;

const businessSchema = Schema({
  isActive: { 
    type: Boolean,
    default: true
  },
  name: String,
  legalName: String, // razón social,
  businessType: String, // giro
  idnumber: String,
  phones: Array({type: String}),
	address:{
		street: String,
		number: Number,
		district: String,
		city: String,
    region: String,
    country: String
  },
  emails: Array({type: String}),
  website: String,
  v3: {
    ip: String,
    nodePort: Number,
    webPort: Number,
    url: String,

  },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  admins: Array({
    description: String ,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    
  }),
  

}, {timestamps: true});

let Business = mongoose.model('Business', businessSchema);

module.exports = Business;