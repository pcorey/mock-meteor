var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

gulp.task('mocha', function() {
    return gulp.src([
        //'../.meteor/meteor/tools/tool-env/install-babel.js',
        '../.meteor/meteor/tools/package-source.js',
        './**/*.js'
      ], { read: false })
        .pipe(mocha({
          reporter: 'list',
          // compilers: {
          //   js: babel({
          //     experimental: true
          //   })
          // }
        }))
        .on('error', gutil.log);
});

gulp.task('default', function() {
    gulp.watch(['../**/*.js'], ['mocha']);
});