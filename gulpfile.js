var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

var jasmine = require('gulp-jasmine');

gulp.task('lint', ['jshint', 'jscs']);

gulp.task('jshint', function() {
    return gulp.src('./lib/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});
gulp.task('jscs', function() {
    return gulp.src('./lib/**/*.js')
        .pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(jshint.reporter('fail'));
});

gulp.task('jasmine-backend', function () {
    return gulp.src('./spec/backend/**/*-spec.js')
        .pipe(jasmine());
});

// Marking the front end tests as dependant on the backend tests
// prevents an issue that jasmine has with running two lots in
//  parallel
gulp.task('jasmine-frontend', ['jasmine-backend'], function () {
    return gulp.src('./spec/frontend/**/*-spec.js')
        .pipe(jasmine());
});

gulp.task('default', ['lint', 'jasmine-backend']);
gulp.task('everything', ['lint', 'jasmine-backend', 'jasmine-frontend']);