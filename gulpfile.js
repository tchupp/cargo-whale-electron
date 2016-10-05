var gulp = require('gulp'),
  del = require('del'),
  rename = require('gulp-rename'),
  traceur = require('gulp-traceur'),
  webserver = require('gulp-webserver');

var config = {
  sourceDir: 'src',
  buildDir: 'build',
  npmDir: 'node_modules'
};


// clean the build dir
gulp.task('clean', function() {
  return del(config.buildDir + '/**/*', {
    force: true
  });
});


// run development task
gulp.task('dev', [
  'dev:watch',
  'dev:serve'
]);


// watch for changes and run the relevant task
gulp.task('dev:watch', function() {
  gulp.watch(config.sourceDir + '/**/*.js',   ['frontend:js']);
  gulp.watch(config.sourceDir + '/**/*.html', ['frontend:html']);
  gulp.watch(config.sourceDir + '/**/*.css',  ['frontend:css']);
});


// serve the build dir
gulp.task('dev:serve', function() {
  gulp.src(config.buildDir)
    .pipe(webserver({
      open: true
    }));
});


// run init tasks
gulp.task('default', [
  'frontend:dependencies',
  'frontend:js',
  'frontend:html',
  'frontend:css'
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
      config.npmDir + '/es6-shim/es6-shim.map'
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
gulp.task('frontend:css', function() {
  return gulp.src(config.sourceDir + '/**/*.css')
    .pipe(gulp.dest(config.buildDir))
});
