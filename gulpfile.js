var gulp = require('gulp'),
    del = require('del'),
    sass = require('gulp-sass'),
    electron = require('gulp-atom-electron'),
    symdest = require('gulp-symdest'),
    tsProject = require('gulp-typescript').createProject('tsconfig.json'),
    browserSync = require('browser-sync').create();


var config = {
    sourceDir: 'src',
    buildDir: 'build',
    packagesDir: 'packages',
    npmDir: 'node_modules',
    bowerDir: 'bower_components'
};

var electronVersion = '0.36.7';


gulp.task('clean', [
    'clean:build',
    'clean:package'
]);

// clean the build dir
gulp.task('clean:build', function () {
    return del(config.buildDir + '/**/*', {
        force: true
    });
});

// clean the package dir
gulp.task('clean:package', function () {
    return del(config.packagesDir + '/**/*', {
        force: true
    });
});


gulp.task('package', [
    'package:osx',
    'package:linux',
    'package:windows'
]);

gulp.task('package:osx', function () {
    return gulp.src(config.buildDir + '/**/*')
        .pipe(electron({
            version: electronVersion,
            platform: 'darwin'
        }))
        .pipe(symdest(config.packagesDir + '/osx'));
});

gulp.task('package:linux', function () {
    return gulp.src(config.buildDir + '/**/*')
        .pipe(electron({
            version: electronVersion,
            platform: 'linux'
        }))
        .pipe(symdest(config.packagesDir + '/linux'));
});

gulp.task('package:windows', function () {
    return gulp.src(config.buildDir + '/**/*')
        .pipe(electron({
            version: electronVersion,
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
gulp.task('dev:watch', function () {

    gulp.watch(config.sourceDir + '/**/*.ts', ['frontend:ts']).on('change', browserSync.reload);
    gulp.watch(config.sourceDir + '/**/*.html', ['frontend:html']).on('change', browserSync.reload);
    gulp.watch(config.sourceDir + '/**/*.scss', ['frontend:sass']);
});

// serve the build dir
gulp.task('dev:serve', function () {
    browserSync.init({
        server: './build'
    });
});


// run frontend tasks
gulp.task('frontend', [
    'frontend:dependencies',
    'frontend:ts',
    'frontend:html',
    'frontend:sass'
]);

// move dependencies into build dir
gulp.task('frontend:dependencies', function () {
    return gulp.src([
        config.npmDir + '/traceur/bin/traceur-runtime.js',
        config.npmDir + '/systemjs/dist/system-csp-production.src.js',
        config.npmDir + '/systemjs/dist/system.js',
        config.npmDir + '/reflect-metadata/Reflect.js',
        config.npmDir + '/angular2/bundles/angular2.js',
        config.npmDir + '/angular2/bundles/angular2-polyfills.js',
        config.npmDir + '/angular2/bundles/router.js',
        config.npmDir + '/rxjs/bundles/Rx.js',
        config.npmDir + '/es6-shim/es6-shim.min.js',
        config.npmDir + '/es6-shim/es6-shim.map',
        config.bowerDir + '/jquery/dist/jquery.min.js',
        config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.min.js'
    ])
        .pipe(gulp.dest(config.buildDir + '/lib'));
});

// compile & move ts
gulp.task('frontend:ts', function () {
    var tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest(config.buildDir));
});

// move html
gulp.task('frontend:html', function () {
    return gulp.src(config.sourceDir + '/**/*.html')
        .pipe(gulp.dest(config.buildDir));
});

// move css
gulp.task('frontend:sass', function () {
    return gulp.src(config.sourceDir + '/**/*.scss')
        .pipe(sass({
            style: 'compressed',
            includePaths: [
                config.sourceDir + '/styles',
                config.bowerDir + '/bootstrap-sass/assets/stylesheets'
            ]
        }))
        .pipe(gulp.dest(config.buildDir))
        .pipe(browserSync.stream());
});


gulp.task('electron', function () {
    return gulp.src([
        config.sourceDir + '/electron/main.js',
        config.sourceDir + '/electron/package.json'
    ])
        .pipe(gulp.dest(config.buildDir));
});
