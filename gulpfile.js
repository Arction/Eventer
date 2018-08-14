// gulpfile.js
const gulp = require('gulp')
const mocha = require('gulp-mocha')
const tslint = require('gulp-tslint')
const watch = (paths, tasks) => () => gulp.watch(paths, tasks)
const allFiles = ['src/**/*.ts', 'test/**/*.ts']
/**
 * Testing Tasks
 */
gulp
    .task('test', (done) => {
        gulp
            .src('./test/**/*.spec.ts', { read: false })
            .pipe(mocha({
                "timeout": 100000,
                require: 'ts-node/register',
                color: true,
                reporter: 'spec'
            }))
        done()
    })
    .task('test:watch', ['test'], watch(allFiles, ['test']))
/**
 * Linting Tasks
 */
gulp
    .task('lint', (done) => {
        gulp.src(allFiles)
            .pipe(tslint({
                formatter: 'verbose'
            }))
            .pipe(tslint.report({ allowWarnings: true }))
        done()
    })
    .task('lint:watch', ['lint'], watch(allFiles, ['lint']))
/**
 * General
 */
gulp
    .task('ci:watch', ['test', 'lint'], watch(allFiles, ['test', 'lint']))

