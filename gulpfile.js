var gulp = require('gulp'); 
var webserver = require('gulp-webserver');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
var log = require('fancy-log');

gulp.task('index', function () {
  var target = gulp.src('index.html');
  
    //log(bowerFiles());
    
  var sources = gulp.src(bowerFiles())
    .pipe(gulp.src(['src/scene/Scene.js','./src/**/*.js', './style/**/*.css'],
      {read: false})
  );
 
  return target.pipe(inject(sources))
    .pipe(gulp.dest('.'));
});


gulp.task('serve', function() {
    gulp.src('.')
        .pipe(webserver({
        livereload: false,
        directoryListing: true,
        open: true
    }));
});