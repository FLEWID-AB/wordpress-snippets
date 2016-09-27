var rsync  = require('gulp-rsync');
var chmod  = require('gulp-chmod');

gulp.task('deploy', function() {
  var paths = [
    "*.php", 
    "*.css", 
    "languages/**/*", 
    "library/**/*", 
    "page-templates/**/*", 
    "template-parts/**/*", 
    "assets/stylesheets/*.css", 
    "assets/images/**/*", 
    "assets/javascript/**/*", 
    "assets/fonts/**/*"
    ];

  // Copy to DIST
  gulp.src(paths,  {base: './'})
    .pipe(gulp.dest('dist/'))

  // Secure the shit out of the files
  gulp.src('dist/**/*', {base: 'dist/'})
    .pipe(chmod(644))
    .pipe(gulp.dest('dist'));

  // Rsync to server
  return gulp.src('./dist/**/*')
    .pipe(rsync({
      root: 'dist',
      incremental: true,
      username: 'USER',
      hostname: 'XXX',
      progress: true,
      destination: 'DIRECT PATH TO WP THEME DIR'
    }));
});
