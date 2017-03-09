'use strict';
var passport = require('passport');
var LocalStrategy = require('passport-local');
var UserMdl = require('../models/Users_mdl');
var CONFIG = require('./config');
class Passport{
	constructor(){
		this.strategy = new LocalStrategy({
			usernameField:'email', passwordField:'password', passReqToCallback:true
		}, function(req, email, password, next){
			UserMdl.findUserByEmail(email).then((userObj) => {
				if(userObj){
					if(userObj.password === password){
						return next(null, userObj);
					}else{
						return next(null, false,req.flash('loginMessage','Email and password does not match'))
					}
				}else{
					return next(null, false, req.flash('loginMessage','The email you entered does not exists'))
				}

			}) 	
		})
	}

	initialize(){
		passport.use(this.strategy);
		passport.serializeUser((user, done ) => {
			done(null, user);
		})
		passport.deserializeUser((user, done) => {
			done(null, user);
		})
		return passport.initialize();
	}

	startSession(){
		return passport.session();
	}

	authenticate(){
		return passport.authenticate('local',{
			failureRedirect:'/response/signin',
			failureFlash:true
		});
	}

	checkAuthentication(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}else{
			res.redirect('/response/signin');
		}
	}

	validateProfile(req, res ,next){
		switch(req.user.role){
			case CONFIG.ROLES.SECURITY_TEAM :
				res.redirect('/admin/map');
				break;
			case CONFIG.ROLE.ADMIN :
				res.redirect('/admin/dashboard');
				break;
			default:
				res.redirect('/response/signout');
		}
	}

	logout(req, res, next){
		req.logout();
		req.session.destroy();
		res.redirect('/response/signin');
	}
}


let passportObj = new Passport();
module.exports = passportObj;



