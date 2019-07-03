/**
 * Created by meathill on 2015/9/7.
 */
var gulp = require('gulp')
  , del = require('del')
  , fs = require('fs')
  , uglify = require('gulp-uglify')
  , size = require('gulp-filesize')
  , htmlmin = require('gulp-htmlmin')
  , concat = require('gulp-concat')
  , replace = require('gulp-replace')
  , zip = require('gulp-zip')
  , sequence = require('gulp-sequence')
  , BIN = 'dest/';

gulp.task('clean', function (callback) {
  del(BIN, { force: true });
  callback();
});

gulp.task('copy', ['clean'], function () {
  return gulp.src('css/*.css')
    .pipe(gulp.dest(BIN + 'css/'));
});

gulp.task('template', function () {
  return gulp.src('template/*.hbs')
    .pipe(gulp.dest(BIN + 'template/'))
});

gulp.task('js', function () {
  return gulp.src(['js/qrcode.js', 'js/app.js'])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(BIN + 'js/'));
});

gulp.task('external', function () {
  return gulp.src('js/insert.js')
    .pipe(uglify())
    .pipe(gulp.dest(BIN + 'js'));
});

gulp.task('html', function () {
  return gulp.src('index.html')
    .pipe(replace(/<script src="(.*)"><\/script>/g, function (match, src) {
      if (src.substr(0, 2) === 'js' && src.indexOf('app.js') === -1) {
        return '';
      }
      return match;
    }))
    .pipe(replace('<!-- ga -->', function (s) {
      var ga = fs.readFileSync('js/ga.js', 'UTF-8');
      return '<script>' + ga + '</script>';
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest(BIN));
});

gulp.task('zip', function () {
  return gulp.src('./dest/**')
    .pipe(zip('dest.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('default', sequence('clean', ['copy', 'js', 'template', 'external', 'html'], 'zip'));
