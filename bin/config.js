module.exports = {

	"SESSION_SECRET":"RESPONSE",
	"ROLES":{
		"ADMIN":"admin",
		"SECURITY_TEAM":"security_team",
		"RESIDENT":"resident"
	},
	"DATABASE":"mongodb://localhost/response_center",
	"DATABASE_PROD":"mongodb://h0m36r0wn:password@ds145299.mlab.com:45299/response_center",
	"SECRET":"SOS",
	"REPORT_TYPES":{
		"EMERGENCY":"emergency",
		"FIRE":"fire",
		"EQUAKE":"earthquake",
		"FLOOD":"flood",
		"MED_EMERGENCY":"medical_emergency",
		"BURGLARY":"burglary",
		"INTIMIDATION":"intimidation",
		"HEINOUS":"heinous_crime",
		"ACCIDENT":"accident",
		"OTHER":"other"
	}
}