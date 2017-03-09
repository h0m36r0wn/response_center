'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var annoucementMdl = new Schema({

	post_title:{
		type:String
	},
	content:{
		type:String
	},
	post_category:{
		type:String
	},
	post_date:{
		type:Date,
		default:function(){
			return Date.now();
		}
	},
	is_published:{
		type:Boolean,
		default:false
	},
	is_deleted:{
		type:Boolean,
		dafault:function(){
			return false;
		}
	}
	
});

var Announcements  = mongoose.model('Announcements',annoucementMdl);

module.exports = Announcements;



module.exports = {
	createAnnouncement: function(postTitle, postContent, postStatus, postCategory){
		return new Promise((resolve, reject) => {
			let annoucement = new Announcements();
			annoucement.post_title = postTitle;
			annoucement.post_category = postCategory;
			annoucement.content = postContent;
			annoucement.is_deleted = false;
			annoucement.is_published = postStatus;
			annoucement.save((err, annoucementObj) => {
				if(err) reject("Unable to save annoucement");
				if(annoucementObj) resolve(annoucementObj._id);
			})
		})
	},

	getAnnoucement:function(postId){
		return new Promise((resolve, reject) => {
			if(postId){
				let query = { "_id":postId };
				Announcements.findOne(query, (err, annoucementObj) => {
					if(err) reject("Failed to get post");
					if(annoucementObj) resolve(annoucementObj);
				})

			}else{
				reject("Announcement not found");
			}
		})
	},

	getAnnoucements:function(){
		return new Promise((resolve, reject) => {
			let query = { is_deleted:false };
			Announcements.find(query)
			.sort('-post_date')
			.exec((err, annoucements) => {
				if(err) reject("Failed to fetch annoucements");
				if(annoucements) resolve(annoucements);
			})
		})
	},

	updateAnnoucement:function(postId, postDetails){
		return new Promise((resolve, reject) => {
			let query = {"_id":postId };
			let updatedData = postDetails;
			let opts = { upsert:false, new:true, safe:true }
			Announcements.findOneAndUpdate(query, updatedData, opts, (err, annoucementObj) => {
				if(err) reject("Unknown error happened while updating annoucement");
				if(annoucementObj) resolve();
			})
		})
	}

}