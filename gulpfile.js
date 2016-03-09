const gulp = require('gulp')
const less = require('gulp-less')
const replace = require('gulp-replace')
const rename = require('gulp-rename')
const cssMin = require('gulp-minify-css')
const resourcesDir = './web/resources'

gulp.task('default', ['bootstrap:css', 'bootstrap:js', 'jquery'])

gulp.task('bootstrap:css', () => {
  const customVars = `${__dirname}/web/resources/less/variables.less`
  const oldImport = '@import "variables.less";'
  const newImport = `@import "${customVars}";`
  return gulp.src('./node_modules/bootstrap/less/bootstrap.less')
    .pipe(replace(oldImport, newImport))
    .pipe(less())
    .pipe(gulp.dest(`${resourcesDir}/css`))
    .pipe(cssMin())
    .pipe(rename(path => path.basename += '.min' ))
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
