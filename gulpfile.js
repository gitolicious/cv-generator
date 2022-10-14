import { readFileSync } from 'fs';
import path from 'path';
import { deleteAsync } from 'del';

import gulp from 'gulp';
import ejs from 'gulp-ejs';
import rename from 'gulp-rename';
import footer from 'gulp-footer';

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

import sourcemaps from 'gulp-sourcemaps';

import yaml from 'js-yaml';
import browserSync from 'browser-sync';

import GetGoogleFonts from 'get-google-fonts';
const ggf = new GetGoogleFonts();


// SASS to CSS dist
gulp.task('sass', gulp
  .series(() => gulp
    .src([
      'src/scss/*.scss'
    ])
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(sourcemaps.write('.'))
    .pipe(rename(function (path) {
      if (path.extname === '.css') path.extname = '.min.css';
    }))
    .pipe(gulp.dest('build/css'))
    ,
    () => gulp
      .src('build/css/*.min.css')
      .pipe(gulp.dest('dist/css'))
  )
);

// 3rd-party CSS to dist
gulp.task('css', () => gulp
  .src([
    'node_modules/devicon/devicon.min.css',
    'node_modules/devicon/fonts/**',
    'node_modules/@fortawesome/fontawesome-free/css/*.min.css',
    'node_modules/@fortawesome/fontawesome-free/webfonts/**',
  ], { base: 'node_modules/' })
  .pipe(gulp.dest('dist/css'))
  .pipe(browserSync.stream())
);

// 3rd-party JS to dist
gulp.task('js', () => gulp
  .src([
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/bootstrap/js/dist/*.js',
    'node_modules/jquery/dist/jquery.slim.min.js',
    'node_modules/@fortawesome/fontawesome-free/js/all.min.js',
  ], { base: 'node_modules/' })
  .pipe(gulp.dest('dist/js'))
  .pipe(browserSync.stream())
);

// 3rd-party source maps to dist
gulp.task('source', gulp
  .parallel(
    () => gulp
      .src([
        'node_modules/bootstrap/dist/js/bootstrap.min.js.map',
        'node_modules/jquery/dist/jquery.slim.js',
        'node_modules/jquery/dist/jquery.slim.min.map',
      ], { base: 'node_modules/' })
      .pipe(gulp.dest('dist/js')),
    //3rd-party JS sourcemap
    () => gulp.
      src('dist/js/jquery/dist/jquery.slim.min.js')
      .pipe(footer('//# sourceMappingURL=jquery.slim.min.map'))
      .pipe(gulp.dest('dist/js/jquery/dist/')),
    //custom CSS sourcemap
    gulp
      .series(
        () => gulp
          .src('build/css/*.map')
          .pipe(gulp.dest('dist/css')),
      ),
  )
);

// 3rd-party fonts to dist
gulp.task('fonts', () => ggf
  .download([
    {
      Roboto: [],
      'Source Sans Pro': [],
    }
  ], {
    outputDir: './dist/fonts',
  }));

// HTML to dist
gulp.task('html', () => gulp
  .src([
    'src/*.html'
  ])
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.stream())
);

// EJS template to HTML dist
gulp.task('ejs', () => gulp
  .src('src/*.ejs')
  .pipe(ejs(
    yaml.load(readFileSync('./src/cv.yaml'))
  ))
  .pipe(rename(function (path) {
    path.extname = '.html';
  }))
  .pipe(gulp.dest('./dist'))
  .pipe(browserSync.stream())
);


// other static files
gulp.task('static', () => gulp
  .src([
    'src/static/**/*.*',
  ])
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.stream())
);


// server task
gulp.task('serve', () => {
  // start browser
  browserSync.init({
    server: './dist',
    browser: 'chrome'
  });

  // watch SCSS
  gulp.watch([
    'node_modules/bootstrap/scss/bootstrap.scss',
    'src/scss/*.scss'
  ])
    .on('change', gulp.series('sass', browserSync.reload));

  // watch HTML
  gulp.watch(['src/*.html'])
    .on('change', gulp.series('html', browserSync.reload));

  // watch EJS
  gulp.watch([
    'src/*.ejs',
    'src/cv.yaml'
  ])
    .on('change', gulp.series('ejs', browserSync.reload));
});

gulp.task('clean', () =>
  deleteAsync([
    'build',
    'dist',
  ])
);

// default run task
gulp.task('default',
  gulp.series(
    gulp.parallel(
      'static',
      'fonts',
      'sass',
      'css',
      'js',
      'html',
      'ejs',
    ),
    'serve'
  )
);
