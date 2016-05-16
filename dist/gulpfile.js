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
var sass = require('gulp-sass');
var moment = require('moment');


var prodPath = "";


/////////////////////////////////////// Default task ///////////////////////////////////////
gulp.task('default', ['js', 'sass'],function() {

});

/////////////////////////////////////// General commands ///////////////////////////////////////

gulp.task('js-prod', gulpSequence('js-prod-build', 'js-watch', 'js-prod-done'));

gulp.task('js-prod-build', gulpSequence('set-prod', ['js-page', 'js-lib','js-component'], 'js-build'));

gulp.task('js-prod-done', function(){
	successMsg("JS Build for production is done");
});

gulp.task('js', gulpSequence('js-dev-build', 'js-watch', 'js-dev-done'));

gulp.task('js-dev-build', gulpSequence('set-dev', 'js-build'));

gulp.task('js-dev-done', function(){
	successMsg("JS Build for development is done");
});

gulp.task('sass', gulpSequence('sass-build', 'sass-watch', 'sass-done'));

gulp.task('sass-done', function(){
	successMsg("SASS Build is done");
});

/////////////////////////////////////// JS ///////////////////////////////////////

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
		gulp.src(jsPrefixAdding(libShared)),
        gulp.src(jsPrefixAdding(comShared)),
        gulp.src(jsPrefixAdding(['pages/index.js']))
    )
    .pipe(concat('index.js'))
    .pipe(gulp.dest('../js/dist/'));

    // Personal page
	inprogressMsg('Building personal page');
	streamqueue({ objectMode: true },
		gulp.src(jsPrefixAdding(libShared)),
        gulp.src(jsPrefixAdding(comShared)),
        gulp.src(jsPrefixAdding(map)),
        gulp.src(jsPrefixAdding(widget)),
        gulp.src(jsPrefixAdding(['pages/personal.js']))
    )
    .pipe(concat('personal.js'))
    .pipe(gulp.dest('../js/dist/'));

    // Done
    successMsg('Building JS is done')
    showLastBuildTime();
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

/////////////////////////////////////// SCSS ///////////////////////////////////////


gulp.task('sass-build', function () {
	var ownCompiled = ['fonts.css'];
	inprogressMsg("Compiling SASS files for Fonts");
	streamqueue({ objectMode: true },
        gulp.src(cssPrefixAdding('*','fonts'))
    )
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(concat('fonts.css'))
    .pipe(gulp.dest('../css/dist'));


	// Common SCSS files
	var common3rdparty = ['animate.css', 'bootstrap.css', 'font-mfizz.css'];
	var personal3rdparty = ['leaflet.css', 'swiper.min.css'];
	var commonComponents = ['*.scss'];
	var pageIndex = ['index.scss'];
	var pagePersonal = ['personal.scss'];
	var pageCommon = ['common.scss'];

	inprogressMsg("Compiling SASS files for Index");
	streamqueue({ objectMode: true },
		gulp.src(cssPrefixAdding(common3rdparty,'3rdParty')),
		gulp.src(cssPrefixAdding(commonComponents,'components')),
        gulp.src(cssPrefixAdding(pageCommon,'pages')),
        gulp.src(cssPrefixAdding(pageIndex,'pages')),
        gulp.src(cssPrefixAdding(ownCompiled,'dist'))
    )
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(concat('index.css'))
    .pipe(gulp.dest('../css/dist'));

    inprogressMsg("Compiling SASS files for Personal");
	streamqueue({ objectMode: true },
		gulp.src(cssPrefixAdding(common3rdparty,'3rdParty')),
        gulp.src(cssPrefixAdding(personal3rdparty,'3rdParty')),
        gulp.src(cssPrefixAdding(commonComponents,'components')),
        gulp.src(cssPrefixAdding(pageCommon,'pages')),
        gulp.src(cssPrefixAdding(pagePersonal,'pages')),
        gulp.src(cssPrefixAdding(ownCompiled,'dist'))
    )
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(concat('personal.css'))
    .pipe(gulp.dest('../css/dist'));

    inprogressMsg("SASS compilation is done");
    showLastBuildTime();
});

gulp.task('sass-watch', function () {
	stayingMsg("Keep watching SCSS files");	
	gulp.watch('../css/3rdParty/*.*ss', ['sass-build']);
	gulp.watch('../css/pages/*.*ss', ['sass-build']);
	gulp.watch('../css/components/*.*ss', ['sass-build']);
	gulp.watch('../css/fonts/*.*ss', ['sass-build']);
});


/////////////////////////////////////// Environments ///////////////////////////////////////

gulp.task('set-prod', function(){
	inprogressMsg('Set path to production');
	prodPath = 'minified/';
});

gulp.task('set-dev',function(){
	inprogressMsg('Set path to development');
	prodPath = '';
});



/////////////////////////////////////// Logging ///////////////////////////////////////

// Msgs
var 
	successMsg = function(msg) {
		console.log(wrapMsg(msg).bold.green);
	},

	inprogressMsg = function(msg) {
		console.log(wrapMsg(msg).yellow.bold);
	},

	errorMsg = function(msg) {
		console.log(msg.red);
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

	showLastBuildTime = function(){
		errorMsg('Last Build at ' + moment().format('MMMM Do YYYY, h:mm:ss a'));
	},

	jsPrefixAdding = function(objs) {
		var ret = [];
		for(var i = 0; i< objs.length; i++) {
			ret.push('../js/' + prodPath + objs[i]);
			verboseMsg(ret[i]);
		}
		return ret;
	},

	cssPrefixAdding = function(objs, prefolder) {
		var ret = [];

		if(prefolder == null || prefolder == undefined)
			prefolder = '';
		else
			prefolder += '/';

		for(var i = 0; i< objs.length; i++) {
			ret.push('../css/' + prefolder+ objs[i]);
			verboseMsg(ret[i]);
		}
		return ret;
	}

	;