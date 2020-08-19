"use strict"
const express = require("express");
const favicon = require("serve-favicon");
const path = require("path");
const stylus = require("stylus");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(stylus.middleware({
    src: path.join(__dirname, "views/stylesheets"),
    dest: path.join(__dirname, "public/stylesheets"),
    compile: (str, path) => stylus(str).set("filename", path).set("compress", true)
}));
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
app.get(["/", "/index.html"],  (req, res) => {
    res.render("index");
});
app.get("/examples.html", (req, res) => {
    res.render("examples");
})

module.exports = app;
