'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var gulpif = require('gulp-if');

var browserSync = require('browser-sync');
var webpack = require('webpack-stream');
var webp = require('webpack');
var argv = require('yargs').argv;

var webpackPlugins = [];
if (argv.production) {
    webpackPlugins.push(
        new webp.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        })
    );
}

console.log(argv.production ? 'Building production package' : 'Building development package');

var $ = require('gulp-load-plugins')();

function webpackWrapper(watch, test, callback) {
  var webpackOptions = {
    watch: watch,
    module: {
      preLoaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'eslint-loader'}],
      loaders: [{ test: /\.js$/, exclude: /node_modules/, loaders: ['ng-annotate', 'babel-loader']}]
    },
    output: { filename: 'index.module.js' },
    plugins: webpackPlugins
  };

  if(watch) {
    webpackOptions.devtool = 'inline-source-map';
  }

  var webpackChangeHandler = function(err, stats) {
    if(err) {
      conf.errorHandler('Webpack')(err);
    }
    $.util.log(stats.toString({
      colors: $.util.colors.supportsColor,
      chunks: false,
      hash: false,
      version: false
    }));
    browserSync.reload();
    if(watch) {
      watch = false;
      callback();
    }
  };

  var sources = [ path.join(conf.paths.src, '/app/index.module.js') ];
  if (test) {
    sources.push(path.join(conf.paths.src, '/app/**/*.spec.js'));
  }

  return gulp.src(sources)
    .pipe(webpack(webpackOptions, null, webpackChangeHandler))
    .pipe(gulpif(argv.localhost, $.replace('http://int.api.ilmiosupereroe.it', 'http://192.168.1.12:8080')))
    .pipe(gulpif(argv.production, $.replace('http://int.api.ilmiosupereroe.it', 'https://api.ilmiosupereroe.it')))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app')));
}

gulp.task('scripts', function () {
  return webpackWrapper(false, false);
});

gulp.task('scripts:watch', ['scripts'], function (callback) {
  return webpackWrapper(true, false, callback);
});

gulp.task('scripts:test', function () {
  return webpackWrapper(false, true);
});

gulp.task('scripts:test-watch', ['scripts'], function (callback) {
  return webpackWrapper(true, true, callback);
});
