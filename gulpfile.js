'use strict'
const gulp = require('gulp')
const babel = require('gulp-babel')
const cleanCss = require('gulp-clean-css')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const del = require('del')

const src  = './client/'
const dest = './client/public/'

gulp.task('default', ['css', 'js'])

gulp.task('clean', () => del([`${dest}/js`, `${dest}/css`]))

gulp.task('watch', ['css:custom', 'js:custom'], () => {
  gulp.watch(`${src}/js/*.js`, ['js:custom'])
  gulp.watch(`${src}/css/*.css`, ['css:custom'])
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
  return gulp.src(`${src}/css/**/*.css`)
    .pipe(gulp.dest(`${dest}/css`))
    .pipe(cleanCss())
    .pipe(rename((path) => path.basename += '.min' ))
    .pipe(gulp.dest(`${dest}/css`))
})

gulp.task('css:bootstrap', () => {
  return gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(gulp.dest(`${dest}/css`))
})

gulp.task('css:hamburgers', () => {
  return gulp.src('./node_modules/hamburgers/dist/hamburgers.min.css')
    .pipe(gulp.dest(`${dest}/css`))
})

gulp.task('css:stars', () => {
  return gulp.src('./node_modules/bootstrap-star-rating/css/star-rating.min.css')
    .pipe(gulp.dest(`${dest}/css`))
})

gulp.task('css:krajee', () => {
  return gulp.src('./node_modules/bootstrap-star-rating/css/theme-krajee-uni.min.css')
    .pipe(gulp.dest(`${dest}/css`))
})


/* js stuff */

gulp.task('js', [
  'js:custom',
  'js:jquery',
  'js:bootstrap',
  'js:stars',
])

gulp.task('js:custom', () => {
  // need to handle errors so the watch task doesn't stop
  const b = babel({ presets: ['es2015'] })
  b.on('error', (err) => { console.error(err.message); b.end() })

  return gulp.src(`${src}/js/**/*.js`)
    .pipe(b)
    .pipe(gulp.dest(`${dest}/js`))
    .pipe(uglify())
    .pipe(rename((path) => path.basename += '.min' ))
    .pipe(gulp.dest(`${dest}/js`))
})

gulp.task('js:jquery', () => {
  return gulp.src('./node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest(`${dest}/js`))
})

gulp.task('js:bootstrap', () => {
  return gulp.src('./node_modules/bootstrap/dist/js/bootstrap.min.js')
    .pipe(gulp.dest(`${dest}/js`))
})

gulp.task('js:stars', () => {
  return gulp.src('./node_modules/bootstrap-star-rating/js/star-rating.min.js')
    .pipe(gulp.dest(`${dest}/js`))
})
