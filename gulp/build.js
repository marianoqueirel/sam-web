'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'del']
  });

var basePath = {
  src  : 'app/',
  dest : 'public/'
};

var srcAssets = {
  styles  : basePath.src + 'styles/',
  scripts : basePath.src + 'js/',
  images  : basePath.src + 'img/'
};

var destAssets = {
  styles  : basePath.dest + 'css/',
  scripts : basePath.dest + 'js/',
  images  : basePath.dest + 'img/',
  fonts   : basePath.dest + 'fonts/'
};

// gulp-minify-html https://npmjs.org/package/gulp-minify-html#options
var minifyHtmlOptions = {
  empty: true,
  spare: true,
  quotes: true
};

var imageminOptions = {
  optimizationLevel: 4,
  progressive: true,
  interlaced: true
};

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

gulp.task('styles', function() {
  return gulp.src(srcAssets.styles + '*.scss')
    .pipe($.sass())
    .on('error', handleError)
    .pipe($.autoprefixer('last 2 version'))
    .pipe($.minifyCss())
    .pipe($.replace('bower_components/bootstrap/dist/fonts', 'fonts'))
    .pipe(gulp.dest('.tmp'))
    .pipe($.size());
});

gulp.task('scripts', function() {
  return gulp.src(srcAssets.scripts + '**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.size());
});

gulp.task('partials', function() {
  return gulp.src('app/views/**/*.html')
    .pipe($.minifyHtml(minifyHtmlOptions))
    .pipe($.angularTemplatecache({
      root: 'views',
      standalone: true
    }))
    .pipe($.angularHtmlify())
    .pipe(gulp.dest('.tmp'))
    .pipe($.size());
});

gulp.task('html', ['styles', 'scripts', 'partials'], function() {
  var htmlFilter = $.filter('*.html'),
      jsFilter = $.filter('**/*.js'),
      cssFilter = $.filter('**/*.css'),
      userefAssets = $.useref.assets();

  return gulp.src('app/*.html')
    .pipe(userefAssets)
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe($.rev())
    .pipe(userefAssets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml(minifyHtmlOptions))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest('public'))
    .pipe($.size());
});

gulp.task('images', function() {
  return gulp.src(srcAssets.images + '**/*')
    .pipe($.imagemin(imageminOptions))
    .pipe(gulp.dest(destAssets.images))
    .pipe($.size());
});

gulp.task('fonts', function() {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(destAssets.fonts))
    .pipe($.size());
});

gulp.task('clean', function(cb) {
  $.del(['.tmp', 'public'], cb);
});

gulp.task('build', ['html', 'fonts', 'images']);
