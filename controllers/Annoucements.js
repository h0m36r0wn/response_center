'use strict';
var annoucementMdl = require('../models/Announcements_mdl');
var coverMdl = require('../models/Covers_mdl');
class Announcements{
	constructor(postTitle, postContent, postStatus, postCategory, postCover){
		this.postTitle = postTitle || null;
		this.postContent = postContent || null;
		this.postCover = postCover || null;
		this.postStatus = postStatus || false;
		this.postCategory = postCategory || false;
	}

	createPost(){
		return new Promise((resolve, reject) => {
			annoucementMdl.createAnnouncement(this.postTitle, this.postContent, this.postStatus, this.postCategory).then(
				(postId) => {
					coverMdl.saveCover(postId,this.postCover).then(
						() => resolve(),
						(err) => reject(err)
					);
				},
				(err) => reject(err)
			)
		})
	}


	getAnnoucement(postId){
		return new Promise((resolve, reject) => {
			annoucementMdl.getAnnoucement(postId).then(
				(annoucementObj) => {
					coverMdl.getItemCover(annoucementObj._id).then(
						(coverPhoto) => {
							var annoucementInfo = {
								annoucementDetails:annoucementObj,
								annoucementCover:coverPhoto.data
							}
							resolve(annoucementInfo);
						},
						(err) => reject(err)
					)
				},
				(err) => reject(err)
			);
		})
		
	}

	getAnnoucements(){
		return new Promise((resolve, reject) => {
			annoucementMdl.getAnnoucements().then(
				(annoucements) => resolve(annoucements),
				(err) => reject(err)
			)
		});
	}

	updateAnnouncement(postId){
		return new Promise((resolve, reject) => {
			var updateDetails = {
				post_title:this.postTitle,
				content:this.postContent,
				post_category:this.postCategory,
				is_published:this.postStatus,
				post_date:new Date()
			}
			annoucementMdl.updateAnnoucement(postId, updateDetails)
				.then(
				() => {
					coverMdl.saveCover(postId, this.postCover).then(
						() => resolve(),
						(err) => reject(err)
					)
				},(err) => reject(err));
		})
	}

	deleteAnnoucement(postId){
		return new Promise((resolve, reject) => {
			var updateDetails = { is_deleted:true };
			annoucementMdl.updateAnnoucement(postId, updateDetails)
				.then(
				() => {
					coverMdl.deleteCover(postId)
						.then(() => resolve(), (err) => reject(err))
				}, () => reject( err))

		})
	}

	getNews(){
		return new Promise((resolve , reject) => {
			annoucementMdl.getAnnoucements()
				.then((annoucements) => {
					var tempAnnoucments = annoucements.map(annoucement => {
						return new Promise((resolve, reject) => {
							var tempAnnoucement = annoucement.toObject();
							coverMdl.getItemCover(tempAnnoucement._id)
								.then(coverObj => {
									tempAnnoucement.cover = coverObj.data;
									tempAnnoucement.exerpt = tempAnnoucement.content.substr(0,100);
									resolve(tempAnnoucement);
								},(err) => reject(err))
						})
					})

					Promise.all(tempAnnoucments)
						.then(data => resolve(data), err => reject(err))
				})
		})
	}
}

module.exports = Announcements;