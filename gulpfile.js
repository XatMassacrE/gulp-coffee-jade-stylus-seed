
  var gulp         = require('gulp'),
      jade         = require('gulp-jade'),
      gutil        = require('gulp-util'),
      stylus       = require('gulp-stylus'),
      coffee       = require('gulp-coffee'),
      concat       = require('gulp-concat'),
      uglify       = require('gulp-uglify'),
      autoprefixer = require('gulp-autoprefixer'),
      rename       = require('gulp-rename'),
      cache        = require('gulp-cache'),
      yargs        = require('yargs').argv,
      browserSync  = require('browser-sync'),
      imagemin     = require('gulp-imagemin'),
      pngquant     = require('imagemin-pngquant'),
      assets       = require('./assets.json'),
      coffeeify    = require('coffeeify'),
      coffeelint   = require('gulp-coffeelint'),
      browserify   = require('browserify'),
      jadeify      = require('jadeify'),
      source       = require('vinyl-source-stream');
sources = {
  jade: 'app/page/*.jade',
  stylus: 'app/layout.styl',
  js: 'app/**/*.coffee'
};

dest = {
  html: 'dist',
  css: 'dist/css',
  js: 'dist/js',
  img: 'dist/img'
};
//Coffeeify options (allows global flag to compile those in the node_modules)

var coffeeifyOptions = {
  extensions: ['.coffee'],
  global: true
};

//Jade options

var jadeifyOptions = {
  extensions : ['.jade'],
  global     : true
};
gulp.task('jade', function(){
  gulp.src(sources.jade)
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(dest.html))
    .pipe(browserSync.stream());

});

gulp.task('js', function(){
    browserify('app/layout.coffee', {
      extensions: ['.coffee', '.js', '.json'],
      path: ['./app/']
    })
    .transform(coffeeifyOptions, coffeeify)
    .transform(jadeifyOptions, jadeify)
    .bundle()
    .pipe(source('layout.js'))
    .pipe(gulp.dest(dest.js))
    // .pipe(rename({suffix: '.min'}))
    // .pipe(uglify())
    // .pipe(gulp.dest(dest.js))
    .pipe(browserSync.reload({stream: true}));
});

var generateCss = function(){
  gulp.src(sources.stylus)
    .pipe(stylus({
      // style: 'compressed',
      'include css': true,
      paths: [__dirname + '/node_modules/', __dirname + '/node_modules/quiz-components/node_modules/']
    }))
    .pipe(autoprefixer({
      browsers: ['last 8 versions'],
      cascade: false
    }))
    .pipe(rename({
      basename: 'layout.css',
      extname: ''
    }))
    .pipe(gulp.dest(dest.css))
    .pipe(browserSync.reload({stream: true}));
};
gulp.task('stylus', generateCss);

gulp.task('assets', function(){
  var destination, result, src;
  results = [];
  for(src in assets){
    destination = assets[src];
    gulp.src(src)
      .pipe(gulp.dest('dist/' + destination));
  }
});

gulp.task('images', function(){
    gulp.src('assets/images/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(dest.img))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('lint', function(){
    gulp.src(sources.js)
      .pipe(coffeelint())
      .pipe(coffeelint.reporter());
  });

gulp.task('watch', ['lint'], function(){
  gulp.watch('app/**/*.styl', ['stylus']);
  gulp.watch('app/**/*.css', ['stylus']);
  gulp.watch('asset/images/*.*', ['images']);
  gulp.watch('app/**/*.jade', ['jade']);
  gulp.watch('app/**/*.coffee', ['js']);
});

gulp.task('server', function () {
    //generateCss();
    yargs.p = yargs.p || 8080;
    browserSync.init({
        server: {
            baseDir: './dist'
        },
        ui: {
            port: yargs.p + 1,
            weinre: {
                port: yargs.p + 2
            }
        },
        port: yargs.p
    });
});

gulp.task('clear', function(done){
  return cache.clearAll(done);
});

gulp.task('build', [ 'jade', 'stylus', 'js', 'assets', 'images']);
gulp.task('default', ['build', 'watch', 'server']);

