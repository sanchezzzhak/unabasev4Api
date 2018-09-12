let User = require('../models/user');
let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
const { log } = console;
let Schema = mongoose.Schema;
// @ts-ignore
let AutoIncrement = require('mongoose-sequence')(mongoose);
let TaskMotive = require('../models/taskMotive');
// mongoosePaginate.paginate.options = { 
//     limit: 50
// };
// @ts-ignore
let taskSchema = Schema({
	name: {
		type: String,
		required: true, 
		maxlength: 255
	},
	description: {type: String},
	creator: { type: Schema.Types.ObjectId, ref: 'User' },
	responsable: { type: Schema.Types.ObjectId, ref: 'User' },
	participants: Array({ 
		_id: { type: Schema.Types.ObjectId, ref: 'User'  },
		isNotify: { type: Boolean, default: true },
		isRead: {type: Boolean, default: false}
	}),
	// tags: Array({
	// 	tag: { type: Schema.Types.ObjectId, ref: 'Tags' }
	// }),
	tags: Array({ type: Schema.Types.ObjectId, ref: 'Tag'}),
	last_modified: Date,
	number: Number,
	// schedule: Date,
	schedule: {
		date: Date,
		someday: {type: Boolean, default: false},
	},
	isNotified: {type: Boolean, default: false },
	isComplete: {type: Boolean, default: false},
	isNull: {type: Boolean, default: false},
	isRead: {type: Boolean, default: false},
	someday: {type: Boolean, default: false},
	owner:  { type: Schema.Types.ObjectId, ref: 'User' },
	subtasks: Array({ type: Schema.Types.ObjectId, ref: 'Subtask'}),
	comments: Array({ type: Schema.Types.ObjectId, ref: 'Comment'}),
	totalSubtask: { type: Number, default: 0 },		
	timer: {
		start: { type: Date, default: null },
		total: {type: Number, default: 0},
		timing: {type: Boolean, default: false},
		times: Array({
			start: Date,
			end: Date,
			duration: Number
		})
	}


}, {timestamps: true});

taskSchema.index({'$**': 'text'});
// taskSchema.plugin(AutoIncrement, {inc_field: 'number'});
taskSchema.plugin(AutoIncrement, {id: 'task_number', inc_field: 'number', reference_fields: ['creator'] });
taskSchema.plugin(mongoosePaginate);
let Task = mongoose.model('Task', taskSchema);

module.exports = Task;

// @ts-ignore
let subtaskSchema = Schema({
	name: String,
	start: { type: Date, default: null },
	times: Array({
		start: Date,
		end: Date,
		duration: Number
	}),
	total: {type: Number, default: 0},
	responsable:  { type: Schema.Types.ObjectId, ref: 'User' },
	creator:  { type: Schema.Types.ObjectId, ref: 'User' },
	task:  { type: Schema.Types.ObjectId, ref: 'Task' },
	isComplete: {type: Boolean, default: false},
	isNull: {type: Boolean, default: false},
	sortNumber: { type: Number }
}, {timestamps: true});

let Subtask = mongoose.model('Subtask', subtaskSchema);
// @ts-ignore
let commentSchema = Schema({
	text: { type: String, maxlength: 2000 },
	creator: { type: Schema.Types.ObjectId, ref: 'User'  },
	date: { type: Date, default: Date.now },
	subtask: { type: Schema.Types.ObjectId, ref: 'Subtask'},
	users: Array({ type: Schema.Types.ObjectId, ref: 'User'}),
	task:  { type: Schema.Types.ObjectId, ref: 'Task' },
	subComment: { type: Schema.Types.ObjectId, ref: 'Comment' }

}, {timestamps: true});
let Comment = mongoose.model('Comment', commentSchema);

// @ts-ignore
let tagSchema = Schema({
	name: String,
	creator: { type: Schema.Types.ObjectId, ref: 'User' },
	isShare: { type: Boolean, default: false },
	participants: Array({ type: Schema.Types.ObjectId, ref: 'User' })
});

let Tag = mongoose.model('Tag', tagSchema);

module.exports = {
	task: Task,
	subtask: Subtask,
	tag: Tag,
	comment: Comment
}
// subtaskSchema.methods.timer = function() {
// 	if(this.start){
// 		let duration = Math.round( ( (now - this.start) / 1000 ) / 60);
// 		this.times.push({
// 			start: this.start,
// 			end: now,
// 			duration: duration
// 		});
// 		this.total += duration;
// 		this.start = null;
// 	}else{
// 		this.start = now;
// 	}
// 	this.save();
// };
Subtask['timer'] = (id, cb) => {
	Subtask.findOne({'_id': id}, (err, subtask) => {
		let now = new Date();
		if(subtask.start){
			// log(now-subtask.start)
			// log(now-subtask.start / 1000)
			// log((now-subtask.start / 1000) / 60)
			let duration = Math.round( ( (now - subtask.start) / 1000 ) / 60);
			subtask.times.push({
				start: subtask.start,
				end: now,
				duration: duration
			});
			subtask.total += duration;
			subtask.start = null;
		}else{
			subtask.start = now;
		}
		subtask.save(cb);
	});
}
Task['timer'] = (id, cb) => {
	Task.findOne({'_id': id}, (err, task) => {
		let now = new Date();
		if(task.timer.start){
			let duration = Math.round( ( (now - task.timer.start) / 1000 ) / 60);
			task.timer.times.push({
				start: task.timer.start,
				end: now,
				duration: duration
			});
			task.timer.total += duration;
			task.timer.start = null;
			task.timer.timing = false;
		}else{
			task.timer.start = now;
			task.timer.timing = true;
		}
		task.save(cb);
	});
}
// Subtask.pause = (id, cb) => {
// 	Subtask.findOne({'_id': id}, (err, subtask) => {
// 		let now = new Date();

// 	});
// }


// taskSchema.methods.updateCom = function(comments) {
// 	let newComment;
	
// 	comments.forEach((com)=>{

// 		newComment = new Comment();
// 		// newComment._id = com._id;
// 		newComment.text = com.text;
// 		newComment.creator = com.creator;
// 		newComment.date = com.date;
// 		newComment.task = task._id;
// 		newComment.save()
// 	})
//     // return bcrypt.compareSync(password, this.password);
// };

// Task.updateComm = (id, comments) => {
// 	let newComment;

// 	if(comments != null){
// 		comments.forEach((com)=>{
	
// 			newComment = new Comment();
// 			newComment._id = com._id;
// 			newComment.text = com.text;
// 			newComment.creator = com.creator;
// 			newComment.date = com.date;
// 			newComment.task = id;
// 			newComment.save()
// 		})

// 	}
// }

Task['read'] = (query, userId, status) => {
	// log('task REad>>>>>>'+status)
	Task.findOne(query, (err, task)=> {
		if(err){
			log(err)
		}else{
			let participant
			if(userId.equals(task.responsable)){
	// log('task REad>>>>>>         responsable')
				task.isRead = status;
			}else{
				participant = task.participants.filter((part) => { return part._id.equals(userId) })
				let idx = task.participants.indexOf(participant[0])
	// log('task REad>>>>>>        participant'+task.participants[idx])
				task.participants[idx].isRead = status
			}
			task.save()
			
		}
	})
}
Task['unread'] = (query, userId) => {


	Task.findOne(query, (err, task)=> {
		if(err){
			log(err)
		}else{
			let participant
			if(!userId.equals(task.responsable)){
				task.isRead = false;
			}
			task.participants.forEach((part) => {
				if(!userId.equals(part._id)){
					part.isRead = false						
				}
			})
			
			task.save()
			
		}
	})
}

Task['updateTask'] = (id, task, options, callback) => {
	let query = {_id: id};

	let update = {
		name: task.name,
		description: task.description,
		responsable: task.responsable,
		motive: task.motive
	};
	// log(update);
	Task.findOneAndUpdate(query, update, options, callback);

}


