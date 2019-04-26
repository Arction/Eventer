// gulpfile.js
const { series, parallel, src, dest, watch } = require('gulp')
const mocha = require('gulp-mocha')
const tslint = require('gulp-tslint')
const typedoc = require('gulp-typedoc')
const rollup = require('rollup')
const rollupTypescript = require('rollup-plugin-typescript2')
const rollupSourceMaps = require('rollup-plugin-sourcemaps')
const terser = require('gulp-terser')
const del = require('del')
const pkg = require('./package.json')
const allFiles = ['src/**/*.ts', 'test/**/*.ts']
// Task functions
/**
 * Bundle function
 */
function bundle() {
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
}
/**
 * Minify function
 */
function minify() {
    return src([pkg.iife])
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
        .pipe(dest('dist'))
}
/**
 * TypeDoc function
 */
function docs() {
    return src(['src/**/*.ts'])
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
}
/**
 * Linting function
 */
function lint() {
    return src(allFiles)
        .pipe(tslint({
            formatter: 'verbose'
        }))
        .pipe(tslint.report({ allowWarnings: true }))
}
/**
 * Lint watch functions
 */
const lintWatcher = () => watch(allFiles, series(lint))
const lintWatch = series(lint, lintWatcher)
/**
 * Testing function
 */
function test() {
    return src('./test/**/*.spec.ts', { read: false })
        .pipe(mocha({
            "timeout": 100000,
            require: 'ts-node/register',
            color: true,
            reporter: 'spec'
        }))
}
/**
 * Test watch functions
 */
const testWatcher = () => watch(allFiles, test)
const testWatch = series(test, testWatcher)
/**
 * Cleaning function
 */
const clean = () => del('dist')
/**
 * CI watch functions
 */
const ciWatcher = () => watch(allFiles, parallel(test, lint))
const ciWatch = series(parallel(test, lint), ciWatcher)
/**
 * Building functions
 */
const build = series(clean, bundle, minify)
const buildWatcher = () => watch(allFiles, build)
const buildWatch = series(build, buildWatcher)

// Export functions for gulp CLI
// Build documentation
exports.docs = docs
// Start testing
exports.test = test
// Start test watching
exports.testWatch = testWatch
// Start linting
exports.lint = lint
// Start lint watching
exports.lintWatch = lintWatch
// Start CI watching
exports.ciWatch = ciWatch
// Clean folder with distribution
exports.clean = clean
// Build distribution
exports.build = build
// Start build watching
exports.buildWatch = buildWatch
// Default case: build distribution
exports.default = build