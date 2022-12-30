import gulp from 'gulp';
import ejs from 'gulp-ejs';
import glob from 'glob';
import path from 'path';
import rename from 'gulp-rename';
import { deleteSync } from 'del';
import browserSync from 'browser-sync';


const distDirectory = './docs';

export const clean = done => {
  deleteSync(distDirectory);
  done();
};

export const buildEjs = () => {
  const sketches = glob.sync('./src/sketches/*')
    .map(sketch => path.posix.basename(sketch));
  console.log(sketches);
  return gulp
    .src('./src/index.ejs')
    .pipe(ejs( {sketches: sketches} ))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(distDirectory));
};

export const copySketches = () => {
  return gulp.src(['./src/sketches/**/*'])
    .pipe(gulp.dest(distDirectory));
};

const browserSyncFunc = () => {
  browserSync.init({
    server: distDirectory,
  });
};

const browserSyncReload = (done) => {
  browserSync.reload();
  done();
};

const watchFiles = () => {
  gulp.watch('./src/**/*', gulp.series(buildEjs, copySketches, browserSyncReload));
};

export default gulp.series(
  clean,
  buildEjs,
  copySketches,
  gulp.parallel(watchFiles, browserSyncFunc)
);

// export default gulp.series(clean, buildEjs, copySketches);


// import gulp from "gulp";
// import ejs from "gulp-ejs";
// import rename from "gulp-rename";
// import htmlbeautify from "gulp-html-beautify";
// import plumber from "gulp-plumber";
// import notify from "gulp-notify";
// import browserSync from "browser-sync";
// import fs from "fs";
// import { deleteSync } from "del";

// // gulpプラグインの読み込み
// // const gulp = require("gulp");
// // const ejs = require("gulp-ejs"); //EJS
// // const rename = require("gulp-rename"); //ファイル出力時にファイル名を変える
// // const htmlbeautify = require("gulp-html-beautify"); //HTML生成後のコードを綺麗にする
// // const plumber = require("gulp-plumber"); //エラーによるタスクの強制停止を防止
// // const notify = require("gulp-notify"); //デスクトップ通知
// // const browserSync = require("browser-sync").create(); //変更を即座にブラウザへ反映
// // const fs = require("fs"); //JSONファイル操作用
// // const del = require("del"); //データ削除用

// const srcBase = "./src";
// const distBase = "./dist";

// const srcPath = {
//   js: srcBase + "/js/**/*.js",
//   json: srcBase + "/**/*.json",
//   ejs: srcBase + "/**/*.ejs",
//   _ejs: "!" + srcBase + "/_inc/**/*.ejs",
// };

// const distPath = {
//   html: distBase + "/**/*.html",
//   js: distBase + "/js",
// };

// /* clean */
// const clean = () => {
//   return del([distBase + "/**"], { force: true });
// };

// /* EJS */
// const ejsFunc = () => {
//   var jsonFile = srcBase + "/data/pages.json",
//     json = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
//   return gulp
//     .src([srcPath.ejs, srcPath._ejs])
//     .pipe(ejs({ json: json }))
//     .pipe(
//       rename({
//         basename: "index", //ファイル名
//         extname: ".html", //拡張子
//       })
//     )
//     .pipe(gulp.dest(distPath.item));
// };

// /* js */
// const jsFunc = () => {
//   return gulp
//     .src(srcPath.js)
//     .pipe(gulp.dest(distPath.js));
// };

// /* ローカルサーバー立ち上げ */
// const browserSyncFunc = () => {
//   browserSync.init(browserSyncOption);
// };

// const browserSyncOption = {
//   server: distBase,
// };

// /* リロード */
// const browserSyncReload = (done) => {
//   browserSync.reload();
//   done();
// };

// /* ファイルの変更時にbrowserSyncReloadする */
// const watchFiles = () => {
//   gulp.watch(srcPath.ejs, gulp.series(ejsFunc, browserSyncReload));
//   gulp.watch(srcPath.js, gulp.series(jsFunc, browserSyncReload));
// };


// exports.default = gulp.series(
//   clean,
//   gulp.parallel(ejsFunc, jsFunc),
//   gulp.parallel(watchFiles, browserSyncFunc)
// );

// exports.build = gulp.series(
//   clean,
//   gulp.parallel(ejsFunc, jsFunc),
// );
