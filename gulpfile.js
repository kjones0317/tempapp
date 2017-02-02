// Gulp.js configuration
var
  // modules
  gulp = require('gulp'),
  newer = require('gulp-newer'),
  imagemin = require('gulp-imagemin'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  assets = require('postcss-assets'),
  autoprefixer = require('autoprefixer'),
  mqpacker = require('css-mqpacker'),
  browserSync = require('browser-sync').create(),
  useref = require('gulp-useref'),
  uglify = require('gulp-uglify'),
  gulpIf = require('gulp-if'),
  cssnano = require('gulp-cssnano'),
  del = require('del'),
  runSequence = require('run-sequence'),

  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  concat = require('gulp-concat'),


  // development mode?
  devBuild = (process.env.NODE_ENV !== 'production'),

  // folders
  folder = {
    src: './src/',
    build: './public/'
  };

  

  gulp.task('browserify', function() {
    // Grabs the app.js file
    return browserify('./src/app/app.js')
        // bundles it and creates a file called main.js
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest(folder.build));
  });


  gulp.task('scripts', function(){
    return gulp.src(['./src/assets/**/*.js'])
            .pipe(uglify())
            .pipe(concat('vendor.min.js'))
            .pipe(gulp.dest(folder.build));
  });

  gulp.task('images', function() {
    var out = folder.build + 'assets/images/';
    return gulp.src(folder.src + 'images/**/*')
        .pipe(newer(out))
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest(out));
  });

  gulp.task('scss', function () {
    var postCssOpts = [
      assets({ loadPaths: ['assets/images/'] }),
      autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
      mqpacker
      ];

      return gulp.src(folder.src + 'assets/scss/*.scss')
          .pipe(sass({
              outputStyle: 'nested',
              imagePath: 'assets/images/',
              precision: 3,
              errLogToConsole: true
            }))
          .pipe(postcss(postCssOpts))
          .pipe(gulp.dest(folder.build + 'assets/css/'))
          .pipe(browserSync.reload({
              stream: true
            }));
  })


  gulp.task('copy', ['browserify'], function() {
        gulp.src(['./src/**/*.html', './src/app/*.json'])
            .pipe(gulp.dest(folder.build))
            .pipe(browserSync.reload({
              stream: true
            }))
  });

  
  gulp.task('browserSync', ['build'], function() {
      browserSync.init({
        server: {
          baseDir: "./public",
          routes: {
            "/bower_components": "bower_components",
            "/node_modules": "node_modules"
          }
        }
      })
   })

  

  // gulp.task('useref', function(){
  //     return gulp.src('*.html')
  //       .pipe(useref())
  //       .pipe(gulpIf('*.js', uglify({mangle: false})))
  //       .pipe(gulpIf('*.css', cssnano()))
  //       .pipe(gulp.dest('dist'))
  // });

  // gulp.task('clean:dist', function() {
  //     return del.sync('dist');
  // })

  gulp.task('build', ['scss', 'copy', 'scripts']);

  // gulp.task('watch', ['browserSync', 'css'], function() {
  //       gulp.watch(folder.src + 'images/**/*', ['images']);
  //       gulp.watch(folder.src + 'scss/**/*', ['css']);
  //       gulp.watch('*.html', browserSync.reload); 
  // })

  // gulp.task('build', function (callback) {
  //     runSequence('clean:dist', 
  //       ['css', 'useref', 'images'],
  //       callback
  //     )
  // })

  gulp.task('default', ['browserSync'], function (callback) {
        // gulp.watch("./src/assets/scss/*.scss", ["scss"]);
        // gulp.watch("./src/assets/**/*.js", ["scripts"]);
        // gulp.watch("./src/app/app.js", ["browserify"]);
        // gulp.watch("./src/*.html, ./src/*.json", ["copy"]);


        // gulp.watch("./public/*.html").on('change', browserSync.reload);
        // gulp.watch("./public/*.js").on('change', browserSync.reload);

    gulp.watch("./src/**/*.*", ["build"]);
    gulp.watch("./public/**/*.*").on('change', browserSync.reload);
    // callback

    })

  