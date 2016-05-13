// Require
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
var colors = require('colors');
var gulpSequence = require('gulp-sequence');
var $ = require('jquery');
var addsrc = require('gulp-add-src');
var streamqueue  = require('streamqueue');


var prodPath = "";


// Gulp tasks
gulp.task('default', function() {

});

gulp.task('js-prod', gulpSequence('js-prod-build', 'js-watch', 'js-prod-done'));

gulp.task('js-prod-build', gulpSequence('set-prod', ['js-page', 'js-lib','js-component'], 'js-build'));

gulp.task('js-prod-done', function(){
	successMsg("JS Build for production is done");
});

gulp.task('js', gulpSequence('js-dev-build', 'js-watch', 'js-dev-done'));

gulp.task('js-dev-build', gulpSequence('set-dev', 'js-build'));

gulp.task('js-dev-done', function(){
	successMsg("JS Build for production is done");
});


gulp.task('js-watch',function(){
	stayingMsg("Keep watching JS files on " + (prodPath.length > 0 ? "PRODUCTION" : "DEVELOPMENT") + " mode");
	var jobName;
	if (prodPath.length > 0)
		jobName = 'js-prod-build';
	else 
		jobName = 'js-dev-build';
	
	gulp.watch('../js/pages/*.js', [jobName]);
	gulp.watch('../js/components/*.js', [jobName]);
	gulp.watch('../js/*.js', [jobName]);
});

gulp.task('js-build', function(){
	var libShared = ['jquery.js', 'bootstrap.js'];
	var comShared = ['components/scrolling.js', 'components/menu.js', 'components/social.js', 'components/ga.js'];
    var map = ['leaflet.js', 'leaflet-mapbox-gl.js', 'bouncemarker.js' ];
    var widget = ['swiper.jquery.min.js'];

	// Index page
	inprogressMsg('Building index page');
	streamqueue({ objectMode: true },
		gulp.src(prefixAdding(libShared)),
        gulp.src(prefixAdding(comShared)),
        gulp.src(prefixAdding(['pages/index.js']))
    )
    .pipe(concat('index.js'))
    .pipe(gulp.dest('../js/dist/'));

    // Personal page
	inprogressMsg('Building personal page');
	streamqueue({ objectMode: true },
		gulp.src(prefixAdding(libShared)),
        gulp.src(prefixAdding(comShared)),
        gulp.src(prefixAdding(map)),
        gulp.src(prefixAdding(widget)),
        gulp.src(prefixAdding(['pages/personal.js']))
    )
    .pipe(concat('personal.js'))
    .pipe(gulp.dest('../js/dist/'));

    // Done
    successMsg('Building JS is done')
});

gulp.task('js-page', function(cb){
	inprogressMsg("Minifying pages");
	pump([
        gulp.src('../js/pages/*.js'),
        uglify(),
        gulp.dest('../js/minified/pages')
	    ],
	    cb
	  );
});

gulp.task('js-lib', function(cb){
	inprogressMsg("Minifying libraries");
	pump([
        gulp.src('../js/*.js'),
        uglify(),
        gulp.dest('../js/minified/')
	    ],
	    cb
	  );
});

gulp.task('js-component', function(cb){
	inprogressMsg("Minifying components");
	pump([
        gulp.src('../js/components/*.js'),
        uglify(),
        gulp.dest('../js/minified/components')
	    ],
	    cb
	  );
});


gulp.task('set-prod', function(){
	inprogressMsg('Set path to production');
	prodPath = 'minified/';
});

gulp.task('set-dev',function(){
	inprogressMsg('Set path to development');
	prodPath = '';
});

gulp.task('scss', function(){
	
});




// Msgs
var 
	successMsg = function(msg) {
		console.log(wrapMsg(msg).bold.green);
	},

	inprogressMsg = function(msg) {
		console.log(wrapMsg(msg).yellow.bold);
	},

	errorMsg = function(msg) {
		console.log(msg.bold.underline.bold);
	},
	wrapMsg = function(msg) {
		return '+++ ' + msg + ' +++';
	},
	stayingMsg = function(msg) {
		console.log(wrapMsg(msg).rainbow);
	},
	verboseMsg = function(msg) {
		console.log(msg.grey);
	},

	prefixAdding = function(objs) {
		var ret = [];
		for(var i = 0; i< objs.length; i++) {
			ret.push('../js/' + prodPath + objs[i]);
			verboseMsg(ret[i]);
		}
		return ret;
	}

	;