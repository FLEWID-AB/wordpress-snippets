var argv   = require('minimist')(process.argv);
var gulpif = require('gulp-if');
var prompt = require('gulp-prompt');
var rsync  = require('gulp-rsync');
var chmod  = require('gulp-chmod');

gulp.task('deploy', function() {
  // Define your paths here
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

  // Rsync options
  var rsyncOptions = {
    root: 'dist',
    incremental: true,  
    progress: true  
  }

  // Check for prod or staging
  if (argv.production) {
    rsyncOptions.hostname = 'HOSTNAME'; // Prod hostname
    rsyncOptions.username = 'USER'; // Prod ssh username
    rsyncOptions.destination = ''; // Prod path where uploaded files go
  } else if(argv.staging){
    rsyncOptions.hostname = 'HOSTNAME'; // Staging hostname
    rsyncOptions.username = 'USER'; // SSH Staging username
    rsyncOptions.destination = ''; // Staging path where uploaded files go
  } else {
    // If no env is defined we dont do anything. You can add your own error logger here.
    return false
  }

  // Rsync to server
  return gulp.src('./dist/**/*')
    .pipe(gulpif(
      argv.production, 
      prompt.confirm({
        message: 'Heads Up! Are you SURE you want to push to PRODUCTION?',
        default: false
    })))  
    .pipe(rsync(rsyncOptions));
});
