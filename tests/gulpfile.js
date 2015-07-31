var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

gulp.task('mocha', function() {
    return gulp.src(['./**/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log);
});

gulp.task('default', function() {
    gulp.watch(['../**/*.js'], ['mocha']);
});