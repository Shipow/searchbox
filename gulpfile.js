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

gulp.task('clean', function() {
  // Return the Promise from del()
  return del("Build");
});

gulp.task('haml', function () {
  return gulp.src('*.haml')
  .pipe(haml())
  .pipe(gulp.dest('Build'));
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
  .src('Build/index.html')
  .pipe(inject(svgs, { transform: fileContents }))
  .pipe(gulp.dest('Build'));
});

gulp.task('prettify', function(callback) {
  return gulp.src('Build/*.html')
  .pipe(prettify({indent_char: ' ', indent_size: 2}))
  .pipe(gulp.dest('Build'));
});

gulp.task('build',['clean'], function(callback) {
  runSequence('haml', 'inlineSvg', 'prettify', callback);
});

gulp.task('sass', function () {
  gulp.src('scss/**/*.sass')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('Build/css'))
  .pipe(livereload());;
});

// gulp.task('sass:watch', function () {
//   gulp.watch('./sass/**/*.scss', ['sass']);
// });

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('scss/*.sass', ['sass']);
});
