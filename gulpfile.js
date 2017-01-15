const _gulp = require('gulp');
const gulpHelp = require('gulp-help');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync');

const gulp = gulpHelp(_gulp);
const reload = browserSync.reload;

const root = {
  src: './src',
  dest: './dist'
};

const paths = {
  styles: {
    src: root.src + '/styles/**/*.scss',
    dest: root.dest + '/styles/'
  },
  scripts: {
    src: root.src + '/scripts/**/*.js',
    dest: root.dest + '/scripts/'
  },
  html: {
    src: root.src + '/**/*.html',
    dest: root.dest + '/'
  },
  fonts: {
    src: root.src + '/fonts/**/*',
    dest: root.dest + '/fonts'
  },
  images: {
    src: root.src + '/images/**/*',
    dest: root.dest + '/images'
  }
};


// Styles Task --------------------------------------------
gulp.task('styles', 'Convert Sass to CSS', () => {
  gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(reload({ stream: true }));
});

// Scripts Task --------------------------------------------
gulp.task('scripts', 'copy JS files to dist folder', () => {
  gulp.src(paths.scripts.src)
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(reload({ stream: true }));
});

// HTML Task -----------------------------------------------
gulp.task('html', 'copy HTML files to dist folder', () => {
  gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(reload({ stream: true }));
});

// Images Task ---------------------------------------------
gulp.task('images', 'Optimize images and move to dest folder', () => {
  gulp.src(paths.images.src)
    .pipe(changed(paths.images.dest)) // ignore unchanged files
    .pipe(imagemin()) // optimize
    .pipe(gulp.dest(paths.images.dest))
    .pipe(reload({ stream: true }));
});

// Font Task ------------------------------------------------
gulp.task('fonts', 'copy and move font files', () => {
  gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(reload({ stream: true }));
});

// Watcher Task ---------------------------------------------
gulp.task('watch', 'Watcher task', () => {
  gulp.watch(paths.images.src, ['images']);
  gulp.watch(paths.fonts.src, ['fonts']);
  gulp.watch(paths.html.src, ['html']);
  gulp.watch(paths.styles.src, ['styles']);
  gulp.watch(paths.scripts.src, ['scripts']);
});

// Serve Taks ------------------------------------------------
gulp.task('serve', 'serve resources', () => {
  browserSync({
    server: './dist',
  });
});

gulp.task('default', ['help', 'fonts', 'images', 'html', 'styles', 'serve', 'watch']);
