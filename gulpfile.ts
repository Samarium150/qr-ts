import gulp from "gulp";
import gulpEsbuild from "gulp-esbuild";
import gulpTypedoc from "gulp-typedoc";

function esbuild() {
    return gulp
        .src(["src/index.ts"])
        .pipe(gulpEsbuild({
            bundle: true,
            sourcemap: true,
            minify: true,
            splitting: true,
            format: "esm",
            target: ["esnext"],
            banner: {
                js: "/** MIT License - Copyright (c) 2021 Samarium */"
            }
        }))
        .pipe(gulp.dest("dist"));
}

function typedoc() {
    return gulp
        .src(["src/*.ts"])
        .pipe(gulpTypedoc({
            out: "dist/docs/",
            name: "qr.ts",
            version: true,
        }));
}

export default gulp.parallel(esbuild, typedoc);
