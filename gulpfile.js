var gulp 	= require('gulp'),
uglify 		= require('gulp-uglify'),
watch 		= require('gulp-watch'),
browserSync = require('browser-sync').create(),

//CSS Plugins
autoprefixer 	= require('autoprefixer'),
postcss 		= require('gulp-postcss'),
cssImport 		= require('postcss-import'),
cssVars 		= require('postcss-simple-vars')
calc 			= require('postcss-calc'),
mixins 			= require('postcss-mixins'),
nested 			= require('postcss-nested'),
minifycss 		= require('gulp-minify-css'),
csshexrgba 		= require('postcss-hexrgba'),
sourcemaps		= require('gulp-sourcemaps'),

concat 			= require('gulp-concat'),
del 			= require('del');


// Styles
gulp.task('styles',['cleanDistStyles'], function() {
	return gulp.src('./public/assets/styles/**/*.css')
		.pipe(postcss([cssImport, cssVars, mixins, calc, nested, autoprefixer, csshexrgba]))
		.pipe(gulp.dest('./public/temp/styles'));
});

gulp.task('buildcss', ['styles'], function() {
	return gulp.src('./public/temp/styles/styles.css')
		.pipe(minifycss())
		.pipe(gulp.dest('./public/dist/assets/styles'));
});


// Scripts
gulp.task('scripts',['cleanDistScripts'], function() {
	return gulp.src('./public/assets/scripts/**/*.js')
		.pipe(concat(('main.js')))
		.pipe(uglify())
		.pipe(gulp.dest('./public/dist/assets/scripts'));
});

// Clean
gulp.task('cleanDistScripts', function() {
	return del.sync([
		'./public/dist/assets/scripts'
	])
});

gulp.task('cleanDistStyles', function() {
	return del.sync([
		'./public/dist/assets/styles'
	])
});




// Watch
gulp.task('watch', function() {

	browserSync.init({
		server: {
			baseDir: "public"
		}
	});

	watch('public/**/*.html', function() {
		browserSync.reload();
	});

	watch('public/assets/scripts/**/*.js', function() {
		gulp.start('scripts');
	});

	watch('public/assets/styles/**/*.css', function() {
		gulp.start('cssInject');
	});



});

gulp.task('cssInject',['buildcss'], function() {
	return gulp.src('public/temp/styles/styles.css')
		.pipe(browserSync.stream());
});

// Default
gulp.task('default', function() {
	console.log('Default');
});