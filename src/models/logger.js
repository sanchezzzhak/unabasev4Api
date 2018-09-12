
let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let Schema = mongoose.Schema;
let AutoIncrement = require('mongoose-sequence')(mongoose);
mongoosePaginate.paginate.options = {
	limit: 15
};

let logSchema = Schema({
	name: String,
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	module: String,
	ip: String,
	userAgent: String,
	description: String,
	doc: { type: Schema.Types.ObjectId },
	multipleDocs: Array({ type: Schema.Types.ObjectId }),
	users: Array({ type: Schema.Types.ObjectId, ref: 'User' })

}, {timestamps: true});


logSchema.index({'$**': 'text'});

logSchema.plugin(mongoosePaginate);

let Log = mongoose.model('Log', logSchema);

module.exports = Log;