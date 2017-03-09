'use strict';
var fake = require('faker');
var Reports_mdl = require('../models/Reports_mdl');
var CONFIG = require('../bin/config');
var mongoose = require('mongoose');
var db = mongoose.connect(CONFIG.DATABASE);
var conn = mongoose.connection;
mongoose.Promise = global.Promise;


Date.prototype.subtractDays = function(days) {
    var dat = new Date(this.valueOf())
    dat.setDate(dat.getDate() - days);
    return dat;
}

function createReport(){
	let reportItems = [];
	let reportLength = process.argv[2] || 10;
	let isValidated = process.argv[3] || false;
	
	for (var i = reportLength - 1; i >= 0; i--) {
		let report = {
			name:fake.name.firstName() + ' '+ fake.name.lastName(),
			mobile_num:09123456789,
			location:{
				lat:fake.address.latitude(),
				lng:fake.address.longitude(),

			},
			isValidated:isValidated,
			report_type:fake.random.objectElement(CONFIG.REPORT_TYPES),
			date_reported: isValidated == 'true'  ? new Date().subtractDays(fake.random.number({min:5, max:20})) : new Date()
		}
		reportItems.push(report);
	}
	
	return reportItems;
}


function generateReport() {
	let reportItems = createReport();
	let promises = reportItems.map((reportItem) => {
		return new Promise((resolve, reject) => {
			Reports_mdl.createReport(reportItem)
				.then(resolve,reject)
		})
	})
	Promise.all(promises).then(() => mongoose.connection.close(),() =>
		mongoose.connection.close())
}
 
conn.on('open', generateReport );