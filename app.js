
/**
 * Module dependencies.
 */

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var favicon = require('serve-favicon');
var morgan = require('morgan');


var http = require('http');
var path = require('path')
  , routes = require('./routes');

var app = express();

var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, X-XSRF-TOKEN');
	next();
};


// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));

app.use(bodyParser());
app.use(methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

var about = require('./routes/about');
app.get('/about', about.about);

var arr = require('./routes/arryoutube');
app.get('/', arr.welcome);
app.get('/arryoutube/trend', arr.displaytrend);
app.get('/arryoutube/bargraph/', arr.displaybargraph);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
