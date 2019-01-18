// gulpfile.js
const gulp = require('gulp')
const mocha = require('gulp-mocha')
const tslint = require('gulp-tslint')
const typedoc = require('gulp-typedoc')
const rollup = require('rollup')
const rollupTypescript = require('rollup-plugin-typescript2')
const rollupSourceMaps = require('rollup-plugin-sourcemaps')
const terser = require('gulp-terser')
const clean = require('gulp-rimraf')
const sequence = require('gulp-sequence')
const pkg = require('./package.json')
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
    .task('clean', () => gulp.src(['dist'])
        .pipe(clean())
    )
    .task('build:rollup', () => {
        return rollup.rollup({
            input: 'src/eventer.ts',
            plugins: [
                rollupTypescript({ typescript: require('typescript'), tsconfig: './tsconfig.json' }),
                rollupSourceMaps()
            ]
        })
            .then(bundle =>
                Promise.all([
                    bundle.write({
                        file: pkg.main,
                        format: 'cjs',
                        exports: 'named',
                        sourcemap: true,
                        name: 'eventer'
                    }),
                    bundle.write({
                        file: pkg.module,
                        format: 'es',
                        exports: 'named',
                        sourcemap: true,
                        name: 'eventer'
                    }),
                    bundle.write({
                        file: pkg.iife,
                        format: 'iife',
                        exports: 'named',
                        sourcemap: true,
                        name: 'eventer'
                    })
                ])
            )
    })
    .task('build:terser', () =>
        gulp.src([pkg.iife])
            .pipe(terser({
                mangle: {
                    toplevel: true,
                    reserved: [
                        'eventer'
                    ],
                    properties: {
                        regex: /\b_\w*/,
                        keep_quoted: true
                    }
                },
                keep_classnames: false,
                keep_fnames: false
            }))
            .pipe(gulp.dest('dist'))
    )
    .task('build', (cb) => sequence('clean', 'build:rollup', 'build:terser', cb))
    .task('build:watch', ['build'], watch(allFiles, ['build']))
/**
 * TypeDoc Tasks
 */
gulp
    .task('docs', _ => {
        gulp.src(['src/**/*.ts'])
            .pipe(typedoc({
                module: 'commonjs',
                target: 'ES5',
                excludeProtected: true,
                excludePrivate: true,
                excludeExternals: true,
                out: 'docs/v0.0.0',
                mode: 'file',
                tsConfig: 'tsconfig.json',
                name: 'Eventer API Documentation',
                hideGenerator: true
            }))
    })
