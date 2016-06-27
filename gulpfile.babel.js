import gulp from 'gulp'
import babel from 'gulp-babel'
import rimraf from 'gulp-rimraf'
import plumber from 'gulp-plumber'
import server from 'gulp-develop-server'
import gutil from 'gulp-util'
import runSequence from 'run-sequence'

/* Build Tasks */

gulp.task('build-src', () => {
  gulp.src('src/**/*.json').pipe(gulp.dest('build'))
  return gulp.src('src/**/*.js')
    .pipe(plumber())
    .pipe(babel())
    .on('error', err => {
      gutil.log(gutil.colors.red('[Code Compilation Error]'))
      gutil.log(gutil.colors.red(err.message))
    })
    .pipe(gulp.dest('build'))
})

gulp.task('clean-build', () => gulp.src('build', { read: false }).pipe(rimraf()))

gulp.task('watch-build', () => gulp.watch('src/**/*', ['build', server.restart]))

gulp.task('sloth:start', () => server.listen({ path: './index.js', env: { BLUEBIRD_WARNINGS: 0 } }))

/* Watch Tasks */

gulp.task('start-dev', callback => runSequence('clean-build', 'build-src', 'watch-build', 'sloth:start', callback))

gulp.task('start', callback => runSequence('clean-build', 'build-src', 'sloth:start', callback))

gulp.task('build', callback => runSequence('clean-build', 'build-src', callback))
