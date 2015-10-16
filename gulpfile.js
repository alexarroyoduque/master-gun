var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    vulcanize = require('gulp-vulcanize'),
    minifyInline = require('gulp-minify-inline'),
    debug = require('gulp-debug'),
    del = require('del'),
    runSequence = require('run-sequence'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');

var path = {
    app: './app/',
    css: './app/',
    audio: './app/audio/{,*/}*.{mp3,ogg}',
    audioElements: './app/elements/{,*/,*/*/}audio/*.{mp3,ogg}',
    fonts: './app/fonts/{,*/}*.{eot,svg,ttf,woff}',
    images: './app/images/{,*/}*.{jpg,png,ico}',
    imagesElements: './app/elements/{,*/,*/*/}images/*.{jpg,png,ico}',
    elements: './app/elements/elements.html',
    elementsVulcanized: './dist/elements/elements.vulcanized.html',
    dist: './dist/',
    distElements: './dist/elements'
};

gulp.task('webserver', function() {
    return gulp.src(path.app)
        .pipe(webserver({
            livereload: true,
            open: true,
        }));
});

gulp.task('webserver:dist', function() {
    return gulp.src(path.dist)
        .pipe(webserver({
            livereload: true,
            open: true,
        }));
});

gulp.task('dist-css', function() {
    return gulp.src(path.app + '*.css')
        .pipe(debug({
            title: 'file:'
        }))
        .pipe(gulp.dest(path.dist));
});

gulp.task('dist-ico', function() {
    return gulp.src(path.app + 'favicon.ico')
        .pipe(debug({
            title: 'file:'
        }))
        .pipe(gulp.dest(path.dist));
});

gulp.task('dist-images-app', function() {
    return gulp.src(path.images)
        .pipe(debug({
            title: 'file:'
        }))
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest(path.dist + 'images'));
});

gulp.task('dist-images-elements', function() {
    return gulp.src(path.imagesElements)
        .pipe(debug({
            title: 'file:'
        }))
        .pipe(tinypng(TINYPNG_API))
        .pipe(gulp.dest(path.distElements));
});

gulp.task('dist-audio-app', function() {
    return gulp.src(path.audio)
        .pipe(debug({
            title: 'file:'
        }))
        .pipe(gulp.dest(path.dist + 'audio'));
});

gulp.task('dist-audio-elements', function() {
    return gulp.src(path.audioElements)
        .pipe(debug({
            title: 'file:'
        }))
        .pipe(gulp.dest(path.distElements));
});

gulp.task('dist-fonts', function() {
    return gulp.src(path.fonts)
        .pipe(debug({
            title: 'file:'
        }))
        .pipe(gulp.dest(path.dist + 'fonts'));
});

gulp.task('dist-index', function() {
    return gulp.src(path.app + 'index.html')
        .pipe(debug({
            title: 'file:'
        }))
        .pipe(usemin({
            html: [htmlmin({
                collapseWhitespace: true
            })]
        }))
        .pipe(replace('elements/elements.html', 'elements/elements.vulcanized.html'))
        .pipe(gulp.dest(path.dist));
});

gulp.task('vulcanize', function() {
    return gulp.src(path.elements)
        .pipe(debug({
            title: 'file:'
        }))
        .pipe(vulcanize({
            inlineScripts: true,
            inlineCss: true,
            stripExcludes: false
        }))
        .pipe(minifyInline())
        .pipe(rename('elements/elements.vulcanized.html'))
        .pipe(gulp.dest(path.dist));
});


// REMOVE: old vulcanized
/*gulp.task('vulcanize-index', function() {
    return gulp.src(path.app + 'index.html')
        .pipe(debug({
            title: 'file:'
        }))
        .pipe(vulcanize({
            inlineScripts: true,
            inlineCss: true,
            stripExcludes: false
        }))
        .pipe(minifyInline())
        .pipe(gulp.dest(path.dist));
});*/

gulp.task('clean', function(cb) {
    del([
        'dist/**',
    ], cb);
});

gulp.task('serve', [
    'webserver'
]);

gulp.task('build', function(cb) {
    runSequence('clean',
        'dist-ico',
        'dist-css',
        'dist-fonts',
        'dist-images-app',
        'dist-images-elements',
        'dist-audio-app',
        'dist-audio-elements',
        'vulcanize',
        'dist-index',
        //'vulcanize-index',
        cb);
});

gulp.task('default', ['serve']);
gulp.task('serve:dist', ['webserver:dist']);
gulp.task('dist', ['build']);
