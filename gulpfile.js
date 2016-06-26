'use strict'
const gulp = require('gulp')
const babel = require('gulp-babel')
const cleanCss = require('gulp-clean-css')
const concat = require('gulp-concat')
const merge = require('merge2')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')

const resourcesDir = './web/resources'

gulp.task('default', ['css', 'js'])

gulp.task('css', css);
function css() {
  return gulp.src([
    './node_modules/hamburgers/dist/hamburgers.css',
    './node_modules/bootstrap/dist/css/bootstrap.css',
    './node_modules/bootstrap-star-rating/css/star-rating.css',
    './node_modules/bootstrap-star-rating/css/theme-krajee-uni.css',
    `${resourcesDir}/css/*.css`,
    './local/web/*.css',
  ])
  .pipe(concat('all.css'))
  .pipe(gulp.dest(`${resourcesDir}/css/dist`))
  .pipe(cleanCss())
  .pipe(rename((path) => path.basename += '.min' ))
  .pipe(gulp.dest(`${resourcesDir}/css/dist`))
}

gulp.task('js', js)
function js() {
  // need to handle errors so the watch task doesn't stop
  const b = babel({ presets: ['es2015'] })
  b.on('error', (err) => { console.error(err.message); b.end() })

  return merge(
    gulp.src('./node_modules/jquery/dist/jquery.js'),
    gulp.src('./node_modules/bootstrap/dist/js/bootstrap.js'),
    gulp.src('./node_modules/bootstrap-star-rating/js/star-rating.js'),
    gulp.src(`${resourcesDir}/js/*.js`).pipe(b)
  )
  .pipe(concat('all.js'))
  .pipe(gulp.dest(`${resourcesDir}/js/dist`))
  .pipe(uglify())
  .pipe(rename((path) => path.basename += '.min' ))
  .pipe(gulp.dest(`${resourcesDir}/js/dist`))
}

gulp.task('watch', () => {
  css()
  js()
  gulp.watch(`${resourcesDir}/js/*.js`, ['js'])
  gulp.watch(`${resourcesDir}/css/*.css`, ['css'])
})
