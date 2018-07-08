const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const c = require('ansi-colors');
const notifier = require('node-notifier');

function showError(err) {
	console.log(
		c.bold.red('###########################################\n'), 
		c.bold.red(err.messageFormatted),
		'\n',
		c.bold.red('###########################################')
	);

	notifier.notify({
		title: 'Compilation error.',
		message: err.messageFormatted
	});

	this.emit('end');
}

gulp.task('sass', function () {
	return gulp.src('./scss/main.scss')
		.pipe(plumber({
			errorHandler: showError
		}))
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'compressed' 
		}))
		.pipe(autoprefixer({
            browsers: ['> 5%']
        }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./css'))
		.pipe(browserSync.stream());

});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        notify: false, //czy pokazywać tooltipa
        //host: "192.168.0.24", //IPv4 Address Wirless LAN adapter WiFi from ipconfig
        //port: 3000, //port na którym otworzy
        //browser: "google chrome" //jaka przeglądarka ma być otwierana - zaleznie od systemu - https://stackoverflow.com/questions/24686585/gulp-browser-sync-open-chrome-only
    });
});

gulp.task('watch', function () {
	gulp.watch('./scss/**/*.scss', ['sass']);
	gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task('default', function() {
	console.log(c.yellow('-------------Starting work--------------'));
	gulp.start(['sass', 'browser-sync', 'watch']);
});

