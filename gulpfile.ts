import * as fs from "fs";
import gulp from "gulp";
import gulpEsbuild from "gulp-esbuild";
import gulpTypedoc from "gulp-typedoc";
import { exec } from "child_process";
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";

const paths = {
    input: "src/**/*.ts",
    entry: "src/index.ts",
    output: "dist"
};

const common = {
    sourcemap: true,
    banner: {
        js: "/** MIT License - Copyright (c) 2021 Samarium */"
    }
};

const unbundled = {
    ...common,
    bundle: false
};

const bundled = {
    ...common,
    bundle: true,
    outdir: "browser",
    minify: true
};

async function clean() {
    await fs.rmSync(paths.output, { force: true, recursive: true });
}

function buildCJS() {
    return gulp.src(paths.input)
        .pipe(gulpEsbuild({
            ...unbundled,
            format: "cjs",
            platform: "node",
            outdir: "cjs"
        }))
        .pipe(gulp.dest(paths.output));
}

function buildESM() {
    return gulp.src(paths.input)
        .pipe(gulpEsbuild({
            ...unbundled,
            format: "esm",
            target: "esnext",
            platform: "node",
            outdir: "esm"
        }))
        .pipe(gulp.dest(paths.output));
}

function buildBundle() {
    return gulp.src(paths.entry)
        .pipe(gulpEsbuild({
            ...bundled,
            format: "iife",
            platform: "browser",
            globalName: "qr"
        }))
        .pipe(gulp.dest(paths.output));
}

function docs() {
    return gulp.src(paths.input)
        .pipe(gulpTypedoc({
            out: paths.output + "/docs"
        }));
}

function declare() {
    return exec("tsc --emitDeclarationOnly");
}

async function extract() {
    await Extractor.invoke(ExtractorConfig.loadFileAndPrepare("api-extractor.json"));
    await fs.rmSync(paths.output + "/types", { recursive: true });
}

export default gulp.series(clean, gulp.parallel(gulp.series(buildCJS, buildESM), buildBundle, docs, gulp.series(declare, extract)));
