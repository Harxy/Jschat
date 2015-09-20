var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');

gulp.task('lint', function() {
    return gulp.src('./lib/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('jasmine', function () {
    return gulp.src('./spec/**/*[sS]pec.js')
        .pipe(jasmine());
});


gulp.task('default', ['lint', 'jasmine']);