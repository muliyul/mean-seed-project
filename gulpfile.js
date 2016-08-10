const path = require('path');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const uglifycss = require('gulp-uglifycss');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();
const publicDir = path.join(__dirname, 'public');
const del = require('del');

gulp.task('scripts', function () {
    gulp.src([
        publicDir + '/**/*.js',
        '!' + publicDir + '/libs/**/*',
        '!' + publicDir + '/**/*.min.js'
    ], {dot: true})
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(publicDir));
});

gulp.task('less', function () {
    gulp.src(publicDir + '/styles/**/*.less')
        .pipe(plumber())
        .pipe(less({
            paths: [publicDir + '/styles/includes']
        }))
        .pipe(gulp.dest(publicDir + '/styles'));
});

gulp.task('css', function () {
    gulp.src([
        publicDir + '/styles/**/*.css',
        '!' + publicDir + '/styles/**/*.min.css'
    ], {dot: true})
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(uglifycss())
        .pipe(concat('styles.min.css'))
        .pipe(gulp.dest(publicDir + '/styles'))
        .pipe(browserSync.stream());
});

/*gulp.task('html', function () {
 gulp.src(baseDir + '/!**!/!*.min.html')
 .pipe(htmlmin())
 .pipe(gulp.dest(baseDir))
 });*/

var bs;

gulp.task('browser-sync', function () {
    bs = browserSync.init({
        proxy: 'localhost:3000'
    });
});

gulp.task('restart-bs', function () {
    if (bs) {
        bs.server.close();
        bs.server.listen(bs.options.get("port"));
    }
});

gulp.task('watch', function () {
    gulp.watch(publicDir + '/**/*.html', browserSync.reload);
    gulp.watch(publicDir + '/styles/**/*.less', ['less']);
    gulp.watch(publicDir + '/styles/**/*.css', ['css'], browserSync.reload);
    gulp.watch([
        publicDir + '/**/*.js',
        '!' + publicDir + '/libs/**/*',
        '!' + publicDir + '/**/*.min.js'
    ], ['scripts'], browserSync.reload);
    gulp.watch('./bin/**/*.js', ['restart-bs'], browserSync.reload);
});

gulp.task('clean', function () {
    del([
        publicDir + '/**/*.min.*',
        publicDir + '/libs/**'
    ]).then(function (paths) {
        console.log('Build files cleaned');
    });
});

gulp.task('serve', ['watch', 'browser-sync']);
gulp.task('default', ['watch']);

