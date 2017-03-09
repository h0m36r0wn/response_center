'use strict';
var express = require('express');
var router = express.Router();
var Annoucements = require('../controllers/Annoucements');
router.route('')
	.get((req, res) => {
		var annoucements = new Annoucements();
		annoucements.getNews()
			.then(data => res.json({data:data}))
	})



module.exports = router;