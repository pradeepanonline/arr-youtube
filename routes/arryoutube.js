/**
 * Main Script for ARR Youtube
 */
"use strict";
var mongo = require('mongodb');
var uri = "mongodb://heroku_app36283253:llm46nefmbrue5kp61l2u2a8q7@ds031632.mongolab.com:31632/heroku_app36283253";

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('ds031632.mongolab.com', 31632, {auto_reconnect: true});
var db = new Db('heroku_app36283253', server);

var ratingData = [];
var timeData = [];
var numViewersData = [];
var videoName = "";
var statsList = [];


db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'youtube' database");
        db.authenticate('heroku_app36283253', 'llm46nefmbrue5kp61l2u2a8q7', function(err, result) {
        	if(err) {
        		console.log("Failed to authenticate");
        		process.exit();
        	} else {
        		db.collection('video', {strict:true}, function(err, collection) {
                    if (err) {
                        console.log("The 'video' collection doesn't exist. Error !!...");
                        process.exit();
                    }
                });
        	}
        });
        
    }
});

var roundNumber = function (number, digits) {
    var multiple = Math.pow(10, digits);
    var roundedNum = Math.round(number * multiple) / multiple;
    return roundedNum;
};


var getFullList = function(res) {
	console.log('Retrieving video list from db ...');
	statsList = [];
	db.collection('video',
			function(err, collection) {
				var cursor = db.collection('video').find();
				cursor
						.each(function(err, item) {
							if (item == null) {
								res.render('arryoutube', {
									title : "A.R.Rahman YouTube Dashboard",
									payload : statsList
								});
							} else {
								var videoId = item._id;
								var videoName = item.title;
								ratingData = [];
								numViewersData = [];
								timeData = [];
								var prevTime = new Date().toDateString();
								for ( var i = 0; i < item.stats.length; i++) {
									var newTime = item.stats[i].timestamp.toDateString();
									if(prevTime == newTime) {
										console.log("Skip");
										continue;
									}
									prevTime = newTime;
									var numViewers = item.stats[i].viewCount;
									numViewersData.push(numViewers / 1);
									var roundedRating = roundNumber(
											item.stats[i].average, 3);
									ratingData.push(roundedRating);
									console.log(item.stats[i].timestamp);
									console.log(item.stats[i].timestamp.toDateString());
									timeData.push(item.stats[i].timestamp.toDateString());
								}

								var stats = {
									videoId : videoId,
									videoName : videoName,
									viewsData : numViewersData,
									ratingData : ratingData,
									timeData : timeData
								};
								var statsobj = JSON.stringify(stats);
								statsList.push(statsobj);
							}
						});

			});
};

exports.displaytrend = function(req, res) {
	console.log("In Display Trend");
	getFullList(res);
	console.log("stats list : " + statsList);	
};


exports.displaybargraph = function(req, res) {
	console.log("In Bar Graph Summary");
	db.collection('summary', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.welcome = function(req, res) {
	console.log('User-Agent: ' + req.headers['user-agent']);
	res.render('about', { title: 'About' });
};

