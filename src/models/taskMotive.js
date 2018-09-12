let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let User = require('../models/user');

let tagsSchema = Schema({
	name: {
		type: String,
		required: true
	},	
	creator: { type: Schema.Types.ObjectId, ref: 'User' },
	isActive: { type: Boolean, default: true}
});


module.exports = mongoose.model('TagsMotive', tagsSchema);