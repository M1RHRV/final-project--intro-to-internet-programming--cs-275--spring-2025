const gulp = require(`gulp`);
const htmlValidator = require(`gulp-html`);
const stylelint = require(`gulp-stylelint`);
const eslint = require(`gulp-eslint`);
const terser = require(`gulp-terser`);
const cleanCSS = require(`gulp-clean-css`);
const htmlmin = require(`gulp-htmlmin`);
const babel = require(`gulp-babel`);
const browserSync = require(`browser-sync`).create();


let validateHTML = () => {
    return gulp.src(`app/html/*.html`)
        .pipe(htmlValidator())
        .pipe(gulp.dest(`app/validated`));
};

let validateCSS = () => {
    return gulp.src(`app/css/*.css`)
        .pipe(stylelint({
            reporters: [{ formatter: `string`, console: true }]
        }));
};

let validateJS = () => {
    return gulp.src(`app/js/*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

let compressHTML = () => {
    return gulp.src(`app/html/*.html`)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(`prod/html`));
};

let compressCSS = () => {
    return gulp.src(`app/css/*.css`)
        .pipe(cleanCSS())
        .pipe(gulp.dest(`prod/css`));
};

let compressJS = () => {
    return gulp.src(`app/js/*.js`)
        .pipe(gulp.dest(`prod/js`));
};

let transpileJSForDev = () => {
    return gulp.src(`app/js/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(gulp.dest(`app/transpiled`));
};

let transpileJSForProd = () => {
    return gulp.src(`app/js/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(terser())
        .pipe(gulp.dest(`prod`));
};

let serve = () => {
    browserSync.init({
        server: {
            baseDir: `app`,
            index: `html/index.html`
        },
        port: 3000,
        open: true,
    });

    gulp.watch(`app/html/*.html`, gulp.series(validateHTML)).on(`change`, browserSync.reload);
    gulp.watch(`app/css/*.css`, gulp.series(validateCSS)).on(`change`, browserSync.reload);
    gulp.watch(`app/js/*.js`, gulp.series(validateJS, transpileJSForDev)).on(`change`, browserSync.reload);
};

// Register tasks in Gulp
gulp.task(`default`, gulp.series(validateHTML, validateCSS, validateJS, transpileJSForDev, serve));
gulp.task(`build`, gulp.series(compressHTML, compressCSS, compressJS, transpileJSForProd));
