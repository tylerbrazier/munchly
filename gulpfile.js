'use strict'
const gulp = require('gulp')
const babel = require('gulp-babel')
const cleanCss = require('gulp-clean-css')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const del = require('del')

const resourcesDir = './web/resources'

gulp.task('default', ['css', 'js'])

gulp.task('css', [
  'css:custom',
  'css:local',
  'css:bootstrap',
  'css:hamburgers',
  'css:stars',
  'css:krajee',
])

gulp.task('js', [
  'js:custom',
  'js:jquery',
  'js:bootstrap',
])

gulp.task('clean', () => del(`${resourcesDir}/*/dist`))

gulp.task('watch', () => {
  cssCustom()
  cssLocal()
  jsCustom()
  gulp.watch(`${resourcesDir}/js/*.js`, ['js:custom'])
  gulp.watch('./local/web/*.css', ['css:local'])
  gulp.watch(`${resourcesDir}/css/*.css`, ['css:custom'])
})


gulp.task('css:custom', cssCustom)
function cssCustom() {
  return gulp.src(`${resourcesDir}/css/*.css`)
    .pipe(gulp.dest(`${resourcesDir}/css/dist`))
    .pipe(cleanCss())
    .pipe(rename((path) => path.basename += '.min' ))
    .pipe(gulp.dest(`${resourcesDir}/css/dist`))
}

gulp.task('css:local', cssLocal)
function cssLocal() {
  return gulp.src('./local/web/*.css')
    .pipe(concat('local.css'))
    .pipe(gulp.dest(`${resourcesDir}/css/dist`))
    .pipe(cleanCss())
    .pipe(rename((path) => path.basename += '.min' ))
    .pipe(gulp.dest(`${resourcesDir}/css/dist`))
}

gulp.task('css:bootstrap', () => {
  return gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(gulp.dest(`${resourcesDir}/css/dist`))
})
gulp.task('css:hamburgers', () => {
  return gulp.src('./node_modules/hamburgers/dist/hamburgers.min.css')
    .pipe(gulp.dest(`${resourcesDir}/css/dist`))
})
gulp.task('css:stars', () => {
  return gulp.src('./node_modules/bootstrap-star-rating/css/star-rating.min.css')
    .pipe(gulp.dest(`${resourcesDir}/css/dist`))
})
gulp.task('css:krajee', () => {
  return gulp.src('./node_modules/bootstrap-star-rating/css/theme-krajee-uni.min.css')
    .pipe(gulp.dest(`${resourcesDir}/css/dist`))
})


gulp.task('js:custom', jsCustom)
function jsCustom() {
  // need to handle errors so the watch task doesn't stop
  const b = babel({ presets: ['es2015'] })
  b.on('error', (err) => { console.error(err.message); b.end() })

  return gulp.src(`${resourcesDir}/js/*.js`)
    .pipe(b)
    .pipe(gulp.dest(`${resourcesDir}/js/dist`))
    .pipe(uglify())
    .pipe(rename((path) => path.basename += '.min' ))
    .pipe(gulp.dest(`${resourcesDir}/js/dist`))
}

gulp.task('js:jquery', () => {
  return gulp.src('./node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest(`${resourcesDir}/js/dist`))
})
gulp.task('js:bootstrap', () => {
  return gulp.src('./node_modules/bootstrap/dist/js/bootstrap.min.js')
    .pipe(gulp.dest(`${resourcesDir}/js/dist`))
})
