

module.exports.percentage = (total, part) => {
	let totalPercentage = total; 
	let complete = (totalPercentage !== 0) ? part / (total) : 0;
	return complete * 100
}
