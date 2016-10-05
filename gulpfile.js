var gulp = require('gulp'),
  del = require('del'),
  rename = require('gulp-rename'),
  traceur = require('gulp-traceur'),
  sass = require('gulp-sass'),
  webserver = require('gulp-webserver'),
  electron = require('gulp-atom-electron'),
  symdest = require('gulp-symdest');

var config = {
  sourceDir: 'src',
  buildDir: 'build',
  packagesDir: 'packages',
  npmDir: 'node_modules',
  bowerDir: 'bower_components'
};


gulp.task('clean', [
  'clean:build',
  'clean:package'
]);

// clean the build dir
gulp.task('clean:build', function() {
  return del(config.buildDir + '/**/*', {
    force: true
  });
});

// clean the package dir
gulp.task('clean:package', function() {
  return del(config.packagesDir + '/**/*', {
    force: true
  });
});


gulp.task('package', [
  'package:osx',
  'package:linux',
  'package:windows'
]);

gulp.task('package:osx', function() {
  return gulp.src(config.buildDir + '/**/*')
    .pipe(electron({
      version: '0.36.7',
      platform: 'darwin'
    }))
    .pipe(symdest(config.packagesDir + '/osx'));
});

gulp.task('package:linux', function() {
  return gulp.src(config.buildDir + '/**/*')
    .pipe(electron({
      version: '0.36.7',
      platform: 'linux'
    }))
    .pipe(symdest(config.packagesDir + '/linux'));
});

gulp.task('package:windows', function() {
  return gulp.src(config.buildDir + '/**/*')
    .pipe(electron({
      version: '0.36.7',
      platform: 'win32'
    }))
    .pipe(symdest(config.packagesDir + '/windows'));
});


// run development task
gulp.task('dev', [
  'dev:watch',
  'dev:serve'
]);

// watch for changes and run the relevant task
gulp.task('dev:watch', function() {
  gulp.watch(config.sourceDir + '/**/*.js', ['frontend:js']);
  gulp.watch(config.sourceDir + '/**/*.html', ['frontend:html']);
  gulp.watch(config.sourceDir + '/**/*.css', ['frontend:css']);
});

// serve the build dir
gulp.task('dev:serve', function() {
  gulp.src(config.buildDir)
    .pipe(webserver({
      open: true
    }));
});


// run frontend tasks
gulp.task('frontend', [
  'frontend:dependencies',
  'frontend:js',
  'frontend:html',
  'frontend:sass'
]);

// move dependencies into build dir
gulp.task('frontend:dependencies', function() {
  return gulp.src([
      config.npmDir + '/traceur/bin/traceur-runtime.js',
      config.npmDir + '/systemjs/dist/system-csp-production.src.js',
      config.npmDir + '/systemjs/dist/system.js',
      config.npmDir + '/reflect-metadata/Reflect.js',
      config.npmDir + '/angular2/bundles/angular2.js',
      config.npmDir + '/angular2/bundles/angular2-polyfills.js',
      config.npmDir + '/rxjs/bundles/Rx.js',
      config.npmDir + '/es6-shim/es6-shim.min.js',
      config.npmDir + '/es6-shim/es6-shim.map',
      config.bowerDir + '/jquery/dist/jquery.min.js',
      config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.min.js'
    ])
    .pipe(gulp.dest(config.buildDir + '/lib'));
});

// transpile & move js
gulp.task('frontend:js', function() {
  return gulp.src(config.sourceDir + '/**/*.js')
    .pipe(rename({
      extname: ''
    }))
    .pipe(traceur({
      modules: 'instantiate',
      moduleName: true,
      annotations: true,
      types: true,
      memberVariables: true
    }))
    .pipe(rename({
      extname: '.js'
    }))
    .pipe(gulp.dest(config.buildDir));
});

// move html
gulp.task('frontend:html', function() {
  return gulp.src(config.sourceDir + '/**/*.html')
    .pipe(gulp.dest(config.buildDir))
});

// move css
gulp.task('frontend:sass', function() {
  return gulp.src(config.sourceDir + '/**/*.scss')
    .pipe(sass({
      style: 'compressed',
      includePaths: [
        config.sourceDir + '/styles',
        config.bowerDir + '/bootstrap-sass/assets/stylesheets'
      ]
    }))
    .pipe(gulp.dest(config.buildDir))
});


gulp.task('electron', function() {
  return gulp.src([
      config.sourceDir + '/electron/main.js',
      config.sourceDir + '/electron/package.json'
    ])
    .pipe(gulp.dest(config.buildDir));
});
