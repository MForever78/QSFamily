var gulp = require("gulp");
var livereload = require("gulp-livereload");
var less = require('gulp-less');
var rename = require("gulp-rename");
var minifycss = require("gulp-minify-css");
var autoprefixer = require("gulp-autoprefixer");

var src = {
    style: "views/assets/css/main.less",
    script: "views/assets/js/main.js"
};

var dest = {
    style: "public/css",
    script: "public/js"
};

gulp.task("style", function() {
    return gulp.src(src.style)
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulp.dest(dest.style))
        .pipe(minifycss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(dest.style));
});

gulp.task("script", function() {
    return gulp.src(src.script)
        .pipe(gulp.dest(dest.script))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min'}))
        .pipe(gulp.dest(dest.script));
});

gulp.task("default", ['script']);

gulp.task("watch", function() {
    gulp.watch("views/assets/css/**/*", ["style"]);
    gulp.watch("views/assets/js/*", ["script"]);

    livereload.listen();

    gulp.watch(["public/**/*", "views/*"]).on("change", livereload.changed);
});

