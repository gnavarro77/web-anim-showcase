let gulp = require('gulp'); 
const { src, dest } = require('gulp');
let webserver = require('gulp-webserver');
let inject = require('gulp-inject');
let bowerFiles = require('main-bower-files');
let log = require('fancy-log');
let concat = require('gulp-concat');
const uglify = require('gulp-uglify');



const cssSelector = './style/**/*.css';
const jsSelector = ['src/scene/Scene.js','./src/**/*.js'];

function selectJs(){
    let sources = gulp.src(bowerFiles())
    .pipe(src(jsSelector, {read: false}));
    return sources;
}

gulp.task('index', function () {
    let target = gulp.src('index.html');
    sources = selectJs().pipe(src(cssSelector,{read:false}));
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


gulp.task('buildJs',  function(){
    return selectJs()
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./docs/'));
});

gulp.task('buildCss',  function(){
    return src(cssSelector)
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./docs/'));
});

gulp.task('buildSvg',  function(){
    return src('./svg/**/*.svg')
        .pipe(gulp.dest('./docs/svg'));
});

gulp.task('build', gulp.parallel('buildJs','buildCss','buildSvg'));

