'use strict'
const gulp = require('gulp')
const babel = require('gulp-babel')
const cleanCss = require('gulp-clean-css')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const del = require('del')
const vfs = require('vinyl-fs')
const fileinclude = require('gulp-file-include')

const src  = './client/src'
const dest = './client/dist/'

gulp.task('default', ['html', 'css', 'js', 'local'])

gulp.task('clean', () => del(dest))

gulp.task('watch', ['html:custom', 'css:custom', 'js:custom'], () => {
  gulp.watch(`${src}/**/*.html`, ['html:custom'])
  gulp.watch(`${src}/**/*.css`, ['css:custom'])
  gulp.watch(`${src}/**/*.js`, ['js:custom'])
})


/* html stuff */

gulp.task('html', ['html:custom'])

gulp.task('html:custom', () => {
  return gulp.src(`${src}/**/*.html`)
    .pipe(fileinclude({ basepath:'./client/partials', indent:true }))
    .pipe(gulp.dest(dest))
})


/* css stuff */

gulp.task('css', [
  'css:custom',
  'css:bootstrap',
  'css:hamburgers',
  'css:stars',
  'css:krajee',
])

gulp.task('css:custom', () => {
  return gulp.src(`${src}/**/*.css`)
    .pipe(gulp.dest(dest))
    .pipe(cleanCss())
    .pipe(rename((path) => path.basename += '.min' ))
    .pipe(gulp.dest(dest))
})

gulp.task('css:bootstrap', () => {
  return gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(gulp.dest(dest))
})

gulp.task('css:hamburgers', () => {
  return gulp.src('./node_modules/hamburgers/dist/hamburgers.min.css')
    .pipe(gulp.dest(dest))
})

gulp.task('css:stars', () => {
  return gulp.src('./node_modules/bootstrap-star-rating/css/star-rating.min.css')
    .pipe(gulp.dest(dest))
})

gulp.task('css:krajee', () => {
  return gulp.src('./node_modules/bootstrap-star-rating/css/theme-krajee-uni.min.css')
    .pipe(gulp.dest(dest))
})


/* js stuff */

gulp.task('js', [
  'js:custom',
  'js:jquery',
  'js:bootstrap',
  'js:stars',
  'js:sortable',
])

gulp.task('js:custom', () => {
  // need to handle errors so the watch task doesn't stop
  const b = babel({ presets: ['es2015'] })
  b.on('error', (err) => { console.error(err.message); b.end() })

  return gulp.src(`${src}/**/*.js`)
    .pipe(b)
    .pipe(gulp.dest(dest))
    .pipe(uglify())
    .pipe(rename((path) => path.basename += '.min' ))
    .pipe(gulp.dest(dest))
})

gulp.task('js:jquery', () => {
  return gulp.src('./node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest(dest))
})

gulp.task('js:bootstrap', () => {
  return gulp.src('./node_modules/bootstrap/dist/js/bootstrap.min.js')
    .pipe(gulp.dest(dest))
})

gulp.task('js:stars', () => {
  return gulp.src('./node_modules/bootstrap-star-rating/js/star-rating.min.js')
    .pipe(gulp.dest(dest))
})

gulp.task('js:sortable', () => {
  return gulp.src('./node_modules/html5sortable/dist/html.sortable.min.js')
    .pipe(gulp.dest(dest))
})


/* local stuff */

gulp.task('local', () => {
  // need to use vinyl-fs because gulp doesn't support no-overwrite yet
  return vfs.src('./client/local_defaults/*')
    .pipe(vfs.dest('./client/local', { overwrite:false }))
})
