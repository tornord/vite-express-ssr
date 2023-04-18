import { join, resolve } from "node:path";
import express from "express";

const publicCat = resolve(".", "public", "static");
const staticOptions = { maxAge: "365d", setHeaders: (res) => res.set("Edge-control", "max-age=31536000") };

export function middleware(app) {
  app.use("/favicon.ico", express.static(join(publicCat, "images/favicon.ico"), staticOptions));
  app.use("/index-f65bc0e0.js", express.static(join(resolve(".", "dist", "client", "assets"), "index-f65bc0e0.js"), staticOptions));
}
