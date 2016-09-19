const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('build', () => {
  gulp.src('src/*.js')
  .pipe(babel({
    presets: ['es2015'],
  }))
  .pipe(gulp.dest('./dist'));

  gulp.src('src/*.html')
  .pipe(gulp.dest('./dist'));
});

// Default Task
gulp.task('default', ['build']);