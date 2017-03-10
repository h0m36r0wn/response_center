'use strict';

var express = require('express');
var router = express.Router();
var Annoucements = require('../controllers/Annoucements');
var Users = require('../controllers/Users');
var CONFIG = require('../bin/config');
var passport = require('../bin/passport');
var Reports = require('../controllers/Reports');
router.route('/dashboard')
		.get(function(req, res){
			res.render('admin/dashboard', { page:'dashboard' });
		})


router.route('/annoucements')
		.get(function(req , res){
			res.render('admin/annoucements', { page:'annoucements', postMessage:req.flash('post') });
		})


router.route('/post')
		.get(function(req, res){
			res.render('admin/post', { page:'annoucements'});
		})
		.post(function(req, res){
			var body = req.body;
			var annoucements = new Annoucements(body.post_title, body.content, body.post_status, body.post_category, body.cover_photo);
			annoucements.createPost().then(() => {
				req.flash('post',"Annoucement successfuly created");
				res.redirect('/admin/annoucements');
			}, () => {
				req.flash('post',"Failed to create annoucement");
				res.redirect('/admin/annoucements');
			})
		})

router.route('/edit_post/:postId')
		.get(function(req, res){
			let postId = req.params.postId;
			let annoucements = new Annoucements();
			annoucements.getAnnoucement(postId).then((annoucementObj) => {
				res.render('admin/post', { page:'annoucements', info:annoucementObj});
			})

		})
		.post(function(req, res){
			let postId = req.params.postId;
			let body = req.body;
			let annoucements = new Annoucements(body.post_title, body.content,
				body.post_status, body.post_category, body.cover_photo);
					annoucements.updateAnnouncement(postId).then(
					() => {
						req.flash('post',"Annoucement successfuly updated");
						res.redirect('/admin/annoucements');
					},
					(err) => {
						req.flash('post',err);
						res.redirect('/admin/annoucements');
					}
			)
		})

router.route('/get_all_annoucenments')
		.get(function(req,res) {
			let annoucements = new Annoucements();
			let data = [];

			if(req.xhr || req.headers.accept.indexOf('json') > -1){ 
				let annoucements = new Annoucements();
				annoucements.getAnnoucements().then(
					(annoucementsObj) => res.json({data:annoucementsObj}),
					(err) => res.status(500).json([])
				)
			}else{
				res.redirect('/admin/annoucements');
			}
		})

router.route('/get_annoucement/:postId')
		.get(function(req, res) {
			if(req.xhr || req.headers.accept.indexOf('json') > -1){
				let annoucements = new Annoucements(); 
				let postId = req.params.postId;
				annoucements.getAnnoucement(postId).then(
					(annoucement) => res.json(annoucement),
					(err) => res.status(500).json({})
				)
			}else{
				res.redirect('/admin/annoucements');
			}
			
		})
router.route('/delete_annoucement/:postId')
		.get(function(req,res){
			let annoucements = new Annoucements();
			let postId = req.params.postId;

			annoucements.deleteAnnoucement(postId)
				.then(
					() => res.json({success:true}),
					(err) => res.json({err:err})
				)
		})
router.route('/map')
		.get(function(req, res){
			res.render('admin/map', { page:'map'});
		})

router.route('/security_team')
		.get(function(req, res){
			res.render('admin/security_team', { page: 'security team'})
		})

router.route('/get_security_team')
		.get(function(req, res) {
			if(req.xhr || req.headers.accept.indexOf('json') > -1 ){
				var users = new Users();
				users.getSecurityTeam()
					.then(
						(team) => res.json({data:team}),
						(err) => res.json([])
					)
			}else{
				res.redirect('/admin/security_team')
			}
		})

router.route('/add_team')
		.get(function(req, res){
			res.render('admin/add_team',{ page: 'security team' })
		})
		.post(function(req, res) {
			var body = req.body;
			var user = new Users(
				body.email, body.password, CONFIG.ROLES.SECURITY_TEAM, body.first_name,
				body.last_name, body.area
			);
			
			user.createUser().then(
				() => {
					req.flash('user','User successfuly created');
					res.redirect('/admin/security_team');
				},
				(err) => {
					req.flash('user',err);
					res.redirect('/admin/security_team');
				}
			);
		})

router.route('/app_preview')
		.get(function(req, res){
			res.render('admin/app_preview', { page:'app preview'})
		})
		
router.route('/reports')
		.get((req, res) => {
			res.render('admin/reports', { page:'Incedent Report  Listing'});
		})
router.route('/get_reports')
		.get((req, res) =>{
			var reports = new Reports();
			reports.getAllReports()
				.then(
					(reportsObj) => res.json({data:reportsObj}),
					(err) => res.json({data:[],err:err})
				)
		})

router.route('/report_action')
		.post((req, res) => {
			let postData = req.body;
			let report = new Reports();
			report.reportAction(postData.type, postData.reportId)
					.then(
						() => res.json({success:true}),
						(err) => res.json({success:false, err:err})
					)
		})

router.route('/stats')
		.get((req, res) => {
			res.render('admin/stats', { page:'Emergency Stats' });
		})
router.route('/get_stats')
		.get((req, res) => {
			var dates = { startDate:req.query.startDate, endDate:req.query.endDate };

			var reports = new Reports();
			reports.getReportsPerDay(dates)
				.then(
					(results) => res.json({data:results}),
					(err) => res.json({data:[],err:err})
				)

		})

router.route('/get_recent_reports')
		.get((req, res) =>{
			var limit = req.query.limit || 10;
			var report = new Reports();
			report.getRecentReports(limit)
				.then(
					(reportsObj) => res.json({reports:reportsObj}),
					(err) => res.json({err:err, reports:[]}) 
				)
		})
module.exports = router;