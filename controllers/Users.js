'use strict';

var UsersMdl = require('../models/Users_mdl');

class Users{
	constructor(email, password, role, first_name, last_name, area){
		this.email = email || null;
		this.password = password || null;
		this.role = role || null;
		this.first_name = first_name || null;
		this.last_name = last_name || null;
		this.area = area || null;
	}

	createUser(){
		return new Promise((resolve, reject) => {
			UsersMdl.createUser(
				this.email, this.password, this.role, this.first_name, this.last_name,
				this.area
			).then(
				() => resolve(),
				(err) => reject(err)
			)
		});
	}

	getSecurityTeam(){
		return new Promise((resolve, reject) => {
			UsersMdl.getSecurityTeam()
				.then((team) => resolve(team), (err) => reject(err))
		})
	}
}


module.exports = Users;