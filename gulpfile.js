'use strict'
const gulp = require('gulp')
const less = require('gulp-less')
const replace = require('gulp-replace')
const rename = require('gulp-rename')
const cleanCss = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const resourcesDir = './web/resources'

gulp.task('default', ['bootstrap:css', 'bootstrap:js', 'jquery', 'menu:js'])

gulp.task('bootstrap:css', () => {
  const customVars = `${__dirname}/web/resources/less/variables.less`
  const oldImport = '@import "variables.less";'
  const newImport = `@import "${customVars}";`
  return gulp.src('./node_modules/bootstrap/less/bootstrap.less')
    .pipe(replace(oldImport, newImport))
    .pipe(less())
    .pipe(gulp.dest(`${resourcesDir}/css`))
    .pipe(cleanCss())
    .pipe(rename( (path) => path.basename += '.min' ))
    .pipe(gulp.dest(`${resourcesDir}/css`))
})

gulp.task('bootstrap:js', () => {
  return gulp.src('./node_modules/bootstrap/dist/js/bootstrap.*.js')
    .pipe(gulp.dest(`${resourcesDir}/js`))
})

gulp.task('jquery', () => {
  return gulp.src('./node_modules/jquery/dist/*')
    .pipe(gulp.dest(`${resourcesDir}/js`))
})

gulp.task('menu:js', () => {
  // need to handle errors so the watch task doesn't stop
  let babe = babel({ presets: ['es2015'] })
  babe.on('error', (err) => { console.error(err.message); babe.end() })
  return gulp.src(`${resourcesDir}/js/menu.js`)
    .pipe(babe)
    .pipe(uglify())
    .pipe(rename( (path) => path.basename += '.min' ))
    .pipe(gulp.dest(`${resourcesDir}/js`))
})

gulp.task('watch', () => {
  gulp.watch(`${resourcesDir}/js/menu.js`, ['menu:js'])
})
