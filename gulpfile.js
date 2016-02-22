var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    //sass = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css'),
    connect = require('gulp-connect');
    // webserver = require('gulp-webserver');

var paths = {
    sass: ['./scss/*.scss', '!./scss/bourbon/*.scss'],
    js: ['./js/*.js']
};
/*
gulp.task('sass', function () {
   return gulp.src( './scss/main.scss' )
        .pipe(sass({ errLogToConsole: true }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('css'));
});
*/
gulp.task('lint', function() {
  return gulp.src('./js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

gulp.task('script', function() {
  return  gulp.src('./js/*.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js/min/'))
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.js, ['script']);

});

gulp.task('connect', function() {
  connect.server();
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['lint', 'script', 'watch','connect']);