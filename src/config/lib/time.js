let moment = require('moment');

module.exports.toDateJs = (dateObj) => {
	// moment('2010-09-15 17:50:00');
	if(dateObj.d.length == 1) {
		dateObj.d = `0${dateObj.d}`
	}
	if(dateObj.m.length == 1) {
		dateObj.m = `0${dateObj.m}`
	}
	let time_string = `${dateObj.y}-${dateObj.d}-${dateObj.m} ${dateObj.h}`;
	let moment_time = moment(time_string);
	let jsDate = new Date(moment_time.toDate())
	let toReturn = {
		moment: moment_time,
		js: jsDate
	}
	return toReturn;
}

module.exports.isWeekend = () => {
	let today = new Date();
	if(today.getDay() == 6 || today.getDay() == 7){
		return true;
	}else{
		return false;
	}

}

