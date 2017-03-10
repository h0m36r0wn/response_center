'use strict';
var mongoose = require('mongoose');
var Schema =  mongoose.Schema;
var CONFIG = require('../bin/config');
var reportsModel = new Schema({
	name:{ type:String },	
	mobile_num:{ type:String },
	location:{
		lat:{ type: String },
		lng:{ type: String }
	},
	report_type:{ type:String, default:() => { return CONFIG.REPORT_TYPES.OTHER } },
	isValidated:{ type:Boolean, default:() => { return false } },
	date_reported:{ type:Date, default:() => { return Date.now() }}
});


var Reports = mongoose.model('Reports',reportsModel);

module.exports = Reports;

var self = module.exports = {
	createReport:(reportItem) => {
		return new Promise((resolve, reject) => {
			var report = new Reports();
			report.name = reportItem.name;
			report.mobile_num = reportItem.mobile_num;
			report.location = reportItem.location;
			report.isValidated = reportItem.isValidated || false;
			report.date_reported = reportItem.date_reported || new Date();
			report.report_type = reportItem.report_type || 'other';
			report.save((err, reportObj) => {
				if(err) reject('Unknown error happened saving report');
				if(reportObj) resolve();
			})
		})
	},
	getReports:() => {
		return new Promise((resolve, reject) => {
			let query = { isValidated:false };
			Reports.find(query, (err, reports) => {
				if(err) reject('Unknown error happened while fetching reports');
				if(reports) resolve(reports)
			})
		})
	},
	removeReport:(reportId) => {
		return new Promise((resolve, reject) => {
			let query = { "_id":reportId };
			Reports.findOneAndRemove(query, (err, removed) => {
				if(err) reject('error occured removing report');
				if(removed) resolve();
			})
		})
	},
	resolveReport:(reportId) => {
		return new Promise((resolve, reject) => {
			let query = { "_id":reportId };
			let opts = { upsert:false, safe:true, new:true };
			let updates = { isValidated:true };
			Reports.findOneAndUpdate(query, updates, opts , (err, isValidated) => {
				if(err) reject('Unknown error occured while validating report');
				if(isValidated) resolve();
			})
		})	
	},
	getReportsPerDay:(dates) => {
		return new Promise((resolve, reject) => {
			let query = { 
				isValidated: true,
				date_reported:{
					"$gte":dates.startDate,
					"$lte":dates.endDate
				}
			 };

			Reports.find(query, (err, results) =>{
				if(err) reject('unknown error happened while getting reports');
				if(results) resolve(results)
			})
		})
	},

	getRecentReports:(limitNum) => {
		return new Promise((resolve,reject) => {
			Reports.find({})
				.limit(parseInt(limitNum))
				.sort('-date_reported')
				.exec((err, reportsObj) => {
					if(err) reject('Unknown error happened while getting reports');
					if(reportsObj) resolve(reportsObj);
				})
		})
	}
}