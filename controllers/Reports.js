'use strict';
var ReportsMdl = require('../models/Reports_mdl');
class Reports{
	
	constructor(name, mobile_num, location, type){
		this.name = name || null;
		this.mobile_num = mobile_num || null;
		this,location = location || null;
		this.type = type || null;
	}
	/**
	* Gets all report
	* @return {Array} reports array
	*/
	getAllReports(){
		return new Promise((resolve, reject) => {
			ReportsMdl.getReports()
				.then(
					(reportsObj) => resolve(reportsObj),
					(err) => reject(err)
				)
		})
	}
	/**
	*	Resolves or remove a report in the database
	* 	@param {Int} reportId
	*	@param {String} action type
	*	@return {Promise}
	*/
	reportAction(type, reportId){
		return new Promise((resolve, reject) => {
			if(type == 'resolve') {
				ReportsMdl.resolveReport(reportId)
					.then(resolve, (err) => reject(err))
			}

			if(type == 'remove'){
				ReportsMdl.removeReport(reportId)
					.then(resolve, (err) => reject(err))
			}
		})
	}

	getReportsPerDay(dates){
		return new Promise((resolve, reject) => {
			ReportsMdl.getReportsPerDay(dates)
				.then(
					(days) => resolve(days)
				)
		})
	}

	
	getRecentReports(limitNum){
		let limit = limitNum || 10;
		return new Promise((resolve, reject) => {
			ReportsMdl.getRecentReports(limit)
				.then(
					(reportsObj) => resolve(reportsObj),
					(err) => reject(err)
				)
		});
	}
}

module.exports = Reports;