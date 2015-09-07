/**
 * Created by Â·¼Ñ on 2015/9/7.
 */
var gulp = require('gulp')
  , del = require('del')
  , DEST = 'dest/';

gulp.task('clean', function (callback) {
  return del(['dest']);
});

gulp.task('copy', function () {
  return gulp.src('css/*.css')
    .pipe(gulp.dest(DEST + 'css/'));
});

gulp.task('default', ['clean', 'copy']);