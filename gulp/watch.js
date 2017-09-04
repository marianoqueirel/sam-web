'use strict';

var gulp = require('gulp');

gulp.task('watch', ['build'],function() {
  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/js/**/*.js', ['scripts']);
  gulp.watch('app/img/**/*', ['images']);
  gulp.watch('app/**/*.html', ['html']);
});
