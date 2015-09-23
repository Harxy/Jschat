var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine-phantom');

gulp.task('lint', function() {
    return gulp.src('./lib/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('jasmine-backend', function () {
    return gulp.src('./spec/backend/**/*-spec.js')
        .pipe(jasmine());
});

gulp.task('jasmine-frontend', function () {
    return gulp.src('./spec/frontend/**/*-spec.js')
        .pipe(jasmine({integration: true}));
});

gulp.task('default', ['lint', 'jasmine-backend', 'jasmine-frontend']);