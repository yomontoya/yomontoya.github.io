var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect');

var paths = {
    js: ['./js/*.js']
};

gulp.task('script', function() {
  return  gulp.src('./js/*.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js/min/'))
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.js, ['script']);
});

gulp.task('connect', function() {
  connect.server();
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['script', 'watch','connect']);