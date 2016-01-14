var gulp = require('gulp');
var svgSymbols = require('gulp-svg-symbols');
var imagemin = require('gulp-imagemin');
var inject = require('gulp-inject');
// var pngquant = require('imagemin-pngquant'); // $ npm i -D imagemin-pngquant

gulp.task('imagemin', function () {
  return gulp.src('src/images/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
      // use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/images'));
});

//.pipe(inject(svgs, { transform: fileContents }))
gulp.task('inject', function () {
  var target = gulp.src('index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var svgs = gulp.src(['assets/svg-symbols.svg'], {read: false});

  return target.pipe(inject(svgs))
    .pipe(gulp.dest('build'));
});

gulp.task('sprites', function () {
  return gulp.src('svg/*.svg')
    .pipe(svgSymbols())
    .pipe(gulp.dest('assets'));
});

gulp.task('default', function() {
  // place code for your default task here
});
