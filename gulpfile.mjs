import gulp from 'gulp';
import ejs from 'gulp-ejs';
import glob from 'glob';
import path from 'path';
import rename from 'gulp-rename';
import { deleteSync } from 'del';
import browserSync from 'browser-sync';
import fs from 'fs';


const distDirectory = './docs';

export const clean = async () => {
  deleteSync(distDirectory);
};

export const copyAssets = async () => {
  return gulp
    .src('./src/assets/**/*')
    .pipe(gulp.dest(distDirectory + '/assets'));
};

export const buildEjs = () => {
  const sketches = glob.sync('./src/sketches/*')
    .map(sketch => {
      const title = path.posix.basename(sketch);
      const thumbnailPath = fs.existsSync(`${sketch}/thumbnail.png`) ?
        `./${title}/thumbnail.png`:
        './assets/images/noimage-thumbnail.png'
      return { title, thumbnailPath, };
    });
  console.info(sketches);
  return gulp
    .src('./src/index.ejs')
    .pipe(ejs({ sketches: sketches, }))
    .pipe(rename({ extname: '.html', }))
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
    copyAssets,
  )
);

export const dev = gulp.series(
  clean,
  buildEjs,
  copySketches,
  copyAssets,
  gulp.parallel(watchFiles, browserSyncFunc)
);

export default dev;
