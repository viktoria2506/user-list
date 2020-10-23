const gulp       = require('gulp');
const mocha      = require('gulp-mocha');
const babel      = require('gulp-babel');
const mergeTasks = require('merge-stream');

const COMPILED_RESOURCES_FOLDER = '_compiled_';

//BUILDING
gulp.task('build', () => {
    const str1 = gulp
        .src(['src/**/*.jsx', 'src/**/*.js'])
        .pipe(babel())
        .pipe(gulp.dest(COMPILED_RESOURCES_FOLDER));

    const copyStr = gulp
        .src(['src/**/*.json', 'src/**/*.css'])
        .pipe(gulp.dest(COMPILED_RESOURCES_FOLDER));

    return mergeTasks(str1, copyStr);
});

//TESTING
gulp.task('test-server', () => {
    return gulp
        .src('./src/test/server/**/*-test.js')
        .pipe(mocha({ exit: true }));
});

gulp.task ('build-and-test', gulp.series('build', 'test-server'))
