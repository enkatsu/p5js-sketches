import gulp from 'gulp';
import ejs from 'gulp-ejs';
import glob from 'glob';
import path from 'path';
import rename from 'gulp-rename';
import { deleteSync } from 'del';
import browserSync from 'browser-sync';


const distDirectory = './docs';

export const clean = async () => {
  deleteSync(distDirectory);
};

export const buildEjs = () => {
  const sketches = glob.sync('./src/sketches/*')
    .map(sketch => path.posix.basename(sketch));
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

const browserSyncReload = async () => {
  browserSync.reload();
};

const watchFiles = () => {
  gulp.watch(
    './src/**/*',
    gulp.series(buildEjs, copySketches, browserSyncReload)
  );
};

export const build = gulp.series(
  clean,
  gulp.parallel(
    buildEjs,
    copySketches,
  )
);

export default gulp.series(
  clean,
  buildEjs,
  copySketches,
  gulp.parallel(watchFiles, browserSyncFunc)
);
