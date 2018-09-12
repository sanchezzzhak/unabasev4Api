let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


let accessSchema = Schema({
	name: { type: String, required: true},
	description: String,
	module: String
});
accessSchema.plugin(AutoIncrement, {inc_field: 'id'});

// let User = module.exports = mongoose.model('User', userSchema);
let Access = module.exports = mongoose.model('access', accessSchema);

// let Access = mongoose.model('access', accessSchema);

// module.exports = Access;
