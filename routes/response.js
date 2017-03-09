'use strict';
var express = require('express');
var router = express.Router();
var passport = require('../bin/passport');

router.route('/signin')
		.get((req, res) => {
			res.render('admin/login',{ page:'signin' , loginMessage:req.flash('loginMessage')});
		})
		.post(passport.authenticate(), passport.validateProfile)
router.route('/signout')
		.get(passport.logout)

module.exports = router;