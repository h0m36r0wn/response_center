'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var coverModel = new Schema({
	data:{
		type:String
	},
	postId:{
		type:Schema.Types.ObjectId,
		ref:'Announcements'
	},
	is_deleted:{
		type:Boolean,
		dafault:false
	}
});


var Cover = mongoose.model('Covers', coverModel);


module.exports = Cover;


module.exports = {
	saveCover:function(postId, coverData){
		return new Promise((resolve, reject) => {
			let query = { "postId":postId };
			let updates = { "data": coverData };
			let opts = { "upsert":true, "new":true, "safe":true }
			Cover.findOneAndUpdate(query, updates, opts,(err, coverObj) => {
				if(err) reject("Unable to update post cover");
				if(coverObj) resolve();
			})
		})
	},
	getItemCover:function(postId){
		return new Promise((resolve, reject) => {
			let query = { "postId":postId };
			Cover.findOne(query, (err, coverObj) => {
				if(err) reject("Unable to find cover");
				if(coverObj) resolve(coverObj);
			})
		})
	},
	deleteCover:function(postId){
		return new Promise((resolve, reject) => {
			let query = { "postId":postId };
			let updates = { is_deleted:true };
			let opts = { upsert:false, new:true, safe:true };
			Cover.findOneAndUpdate(query. updates, opts, (err, coverObj) => {
				if(err) reject("Unknown error happened while deleting cover");
				if(coverObj) resolve();
			})
		})
	}
}