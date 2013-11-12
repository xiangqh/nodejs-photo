var Path = require('path');
var fs = require('fs');
var Photo = require('../models/Photo');

var photos = [];
photos.push({
	name : 'Node.js Logo',
	path : 'http://nodejs.org/images/logos/nodejs-green.png'
});
photos.push({
	name : 'Ryan Speaking',
	path : 'http://nodejs.org/images/ryan-speaker.jpg'
});

exports.list = function(req, res, next) {
	Photo.find({}, function(err, photos) {
		if (err) {
			return next(err);
		}
		res.render('photos', {
			title : 'Photos',
			photos : photos
		});
	});
};

exports.form = function(req, res) {
	res.render('photos/upload', {
		title : 'Photos upload'
	});
};

exports.submit = function(dir) {
	return function(req, res, next) {
		var img = req.files.photo.image;
		var name = req.body.photo.name || img.name;
		var imgPath = Path.join(dir, img.name);
		fs.rename(img.path, imgPath, function(err) {
			console.log(imgPath);
			if (err) {
				return next(err);
			}
			console.log(1);
			Photo.create({
				name : name,
				path : img.name
			}, function(err) {
				if (err) {
					console.log(2);
					return next(err);
				}
				res.redirect('/');
			});
		});
	};
};

exports.download = function(dir) {
	return function(req, res, next) {
		var id = req.params.id;
		Photo.findById(id, function(err, photo) {
			if (err) {
				return next(err);
			}
			var path = Path.join(dir, photo.path);
		//	res.sendfile(path);
			res.download(path, photo.name+'.jpeg');
		});
	};
};