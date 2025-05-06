const gulp = require(`gulp`);
const htmlValidator = require(`gulp-html`);
const stylelint = require(`gulp-stylelint`);
const eslint = require(`gulp-eslint`);
const cleanCSS = require(`gulp-clean-css`);
const htmlmin = require(`gulp-htmlmin`);
const babel = require(`gulp-babel`);
const uglify = require(`gulp-uglify`);
const browserSync = require(`browser-sync`).create();

// Validate HTML
let validateHTML = () => {
    return gulp.src(`app/html/*.html`)
        .pipe(htmlValidator())
        .pipe(gulp.dest(`app/validated`));
};

// Validate CSS
let validateCSS = () => {
    return gulp.src(`app/css/*.css`)
        .pipe(stylelint({
            reporters: [{ formatter: `string`, console: true }]
        }));
};

// Validate JS
let validateJS = () => {
    return gulp.src(`app/js/*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

let transpileJSForProd = () => {
    return gulp.src(`app/js/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(gulp.dest(`temp/js`));
};

// Compress JS
let compressJS = () => {
    return gulp.src(`temp/js/*.js`)
        .pipe(uglify())
        .pipe(gulp.dest(`prod/js`));
};

// Compress HTML
let compressHTML = () => {
    return gulp.src(`app/html/*.html`)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(`prod/html`));
};

// Compress CSS
let compressCSS = () => {
    return gulp.src(`app/css/*.css`)
        .pipe(cleanCSS({ compatibility: `ie8` }))
        .pipe(gulp.dest(`prod/css`));
};

// Transpile JS for Development
let transpileJSForDev = () => {
    return gulp.src(`app/js/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(gulp.dest(`app/transpiled`));
};

// Live Server with BrowserSync
let serve = () => {
    browserSync.init({
        server: {
            baseDir: [`./`, `./styles`, `temp`],
            index: `html/index.html`
        },
        port: 3000,
        open: true,
    });

    gulp.watch(`app/html/*.html`, gulp.series(validateHTML)).on(`change`, browserSync.reload);
    gulp.watch(`app/css/*.css`, gulp.series(validateCSS)).on(`change`, browserSync.reload);
    gulp.watch(`app/js/*.js`, gulp.series(validateJS, transpileJSForDev)).on(`change`, browserSync.reload);
};

//My Tasks
gulp.task(`dev`, gulp.series(validateHTML, validateCSS, validateJS, transpileJSForDev, serve));
gulp.task(`build`, gulp.series(transpileJSForProd, compressJS, compressHTML, compressCSS));
