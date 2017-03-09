var express = require('express');
var router = express.Router();

router.route('/send_alert')	
		.get(function(req, res) {
			res.render('admin/send_alert', { page:'resident test'})
		})

module.exports = router