var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('lint', function() { 
    return gulp.src('js/*.js')
                         .pipe(jshint())
                         .pipe(jshint.reporter('default'));
                         });
