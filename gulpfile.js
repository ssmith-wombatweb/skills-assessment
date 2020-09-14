const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

const postCssPlugins = [autoprefixer()];

function compileScss() {
  return gulp
    .src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(postCssPlugins))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}

function watchScss() {
  return gulp.watch('./src/scss/**/*.scss', compileScss);
}

function runBrowserSync() {
  return browserSync.init({
    server: {
      watch: true,
      baseDir: './build/**',
    },
  });
}

function copyHTML() {
  return gulp.src('./src/**/*.html').pipe(gulp.dest('./build'));
}

function buildScss() {
  postCssPlugins.push(cssnano());
  return gulp
    .src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(postCssPlugins))
    .pipe(gulp.dest('./build/css'));
}

gulp.task('watch', gulp.series(compileScss, copyHTML, gulp.parallel(watchScss, runBrowserSync)));
gulp.task('build', gulp.parallel(copyHTML, buildScss));
gulp.task('start', gulp.series(copyHTML, gulp.parallel(buildScss, runBrowserSync)));
