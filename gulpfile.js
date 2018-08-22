const gulp = require('gulp');
const less = require('gulp-less');
const stylus = require('gulp-stylus');
const pug = require('gulp-pug');
const plumberNotifier = require('gulp-plumber-notifier');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const cleanss = require('gulp-cleancss');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const merge = require('merge-stream');
const imagemin = require('gulp-imagemin');
const run = require('run-sequence');
const del = require('del');
const concat = require('gulp-concat');

const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const path = require('path');


gulp.task('stylus', function () {
  return gulp.src('src/styl/style.styl')
    .pipe(plumberNotifier())
    .pipe(stylus())
    .pipe(postcss([
        autoprefixer({browsers: [
          'last 2 versions',
          'Explorer >= 10'
          ]}),
        mqpacker ({
          sort: true
        })
    ]))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(cleanss())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});


gulp.task('js', function() {
  return gulp.src('src/js/*.js')
    .pipe(plumberNotifier())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream());
});

gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(plumberNotifier())
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.stream());
});

gulp.task('pug', function() {
  return gulp.src('./src/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.stream());
});


gulp.task('images', function() {
  return gulp.src('src/img/**/')
    .pipe(gulp.dest('build/img/'));
});

gulp.task('copy', function() {
  return gulp.src([
    "src/fonts/**",
    "src/img/**"
    ], {
      base: 'src'
    })
    .pipe(gulp.dest("build"));
});

gulp.task('del', function() {
  return del('build');
})

//build project
gulp.task('build', function(done){
  run(
    'del',
    'images',
    'copy',
    'stylus',
    'js',
    'pug',
    done
    );
});

// browserSync
gulp.task('serve', ['build'], function(){
  browserSync.init({
    server: "build",
    });
  gulp.watch('src/styl/**/*.styl', ['stylus']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/**/*.pug', ['pug']);
  gulp.watch('src/img/**/**', ['images']);
});

gulp.task("sprite", function () {
  return gulp.src("src/img/sprite/*.svg")
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("src/img/"));
});



