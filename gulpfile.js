var gulp = require('gulp');
var inject = require('gulp-inject');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var path = require('path');
var sass = require('gulp-sass');
var haml = require('gulp-haml');
var prettify = require('gulp-html-prettify');
var runSequence = require('run-sequence');
var del = require('del');
var livereload = require('gulp-livereload');
var webserver = require('gulp-webserver');

gulp.task('clean', function() {
  // Return the Promise from del()
  return del("build");
});

gulp.task('haml', function () {
  return gulp.src('*.haml')
  .pipe(haml())
  .pipe(gulp.dest('build'));
});

gulp.task('inlineSvg', function () {
  var svgs = gulp.src('svg/*.svg')
  .pipe(svgmin(function (file) {
    var prefix = path.basename(file.relative, path.extname(file.relative));
    return {
      plugins: [{
        cleanupIDs: {
          prefix: prefix + '-',
          minify: true
        }
      }]
    }
  }))
  .pipe(svgstore({ inlineSvg: true }));
  function fileContents (filePath, file) {
    return file.contents.toString();
  }
  return gulp
  .src('build/index.html')
  .pipe(inject(svgs, { transform: fileContents }))
  .pipe(gulp.dest('build'));
});

gulp.task('prettify', function(callback) {
  return gulp.src('build/*.html')
  .pipe(prettify({indent_char: ' ', indent_size: 2}))
  .pipe(gulp.dest('build'));
});

gulp.task('build',['clean','sass'], function(callback) {
  runSequence('haml', 'inlineSvg', 'prettify', callback);
});

gulp.task('sass', function () {
  gulp.src('scss/**/*.sass')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('build/css'))
  .pipe(livereload());;
});

gulp.task('webserver', function() {
  gulp.src('build')
    .pipe(webserver({
      port: 1337,
      livereload: true,
      directoryListing: false,
      open: true

    }));
});

gulp.task('watch:sass', function() {
  livereload.listen();
  gulp.watch('scss/*.sass', ['sass']);
});

gulp.task('watch:haml', function() {
  livereload.listen();
  gulp.watch('*.haml', ['build']);
});

gulp.task('watch',['watch:sass','watch:haml'], function() {

});
