'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CONFIG = require('../bin/config');
var usersModel = new Schema({
	email:{
		type:String
	},
	password:{
		type:String
	},
	role:{
		type:String
	},
	first_name:{
		type:String
	},
	last_name:{
		type:String
	},
	area:{
		type:String,
		default:function(){
			return 'global'
		}
	}
});

var Users = mongoose.model('Users',usersModel);
module.exports = Users;
module.exports = {
	findUserByEmail:(email) => {
		return new Promise((resolve, reject) => {
			
			let query = { email:email };

			Users.findOne(query, (err, user) => { 
				if(err) reject("Unknown error occured while finding user");
				if(user){
					resolve(user);
				}else{
					resolve(null);
				}
			})
		})
	},
	createUser:(email, password, role, first_name, last_name, area) =>{
		return new Promise((resolve, reject) => {
			var user = new Users({
				email:email,
				password:password,
				role:role || CONFIG.ROLES.ADMIN,
				first_name:first_name,
				last_name:last_name,
				area:area || 'global'
			});

			user.save((err, userObj) => {
				if (err) reject("Failed to create user");
				if(userObj) resolve();
			})
		})
	},

	getSecurityTeam:() => {
		return new Promise((resolve, reject) => {
			let query =  { "role":CONFIG.ROLES.SECURITY_TEAM };
			Users.find(query)
				 .select({'password':0})
				 .exec((err, team) => {
				 	console.log(err);
				 	console.log(team);
				 	if(err) reject("Failed to fetch team");
					if(team) resolve(team)
				 })
		})
	}
}


