import fs from "fs";
import path from "path";
import pug from "pug";
import * as sass from "sass";

const pugDir = path.resolve("src/pug");
const sassDir = path.resolve("src/sass");
const distDir = path.resolve("dist");
const distHtml = path.join(distDir, "index.html");
const distCss = path.join(distDir, "styles.css");

function buildPug() {
  try {
    const isProd = process.env.NODE_ENV === "production";
    const compiled = pug.compileFile(path.join(pugDir, "index.pug"), {
      pretty: !isProd,
      compileDebug: !isProd,
      basedir: pugDir,
    })();

    fs.writeFileSync(distHtml, compiled);
    console.log(`[build] Pug compiled to ${distHtml}`);
  } catch (err) {
    console.error("[build] Pug error:", err.message);
  }
}

function buildSass() {
  try {
    const isProd = process.env.NODE_ENV === "production";
    const result = sass.compile(path.join(sassDir, "styles.sass"), {
      style: isProd ? "compressed" : "expanded",
      loadPaths: [sassDir],
    });

    fs.writeFileSync(distCss, result.css);
    console.log(`[build] Sass compiled to ${distCss}`);
  } catch (err) {
    console.error("[build] Sass error:", err.message);
  }
}

function buildAll() {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  buildPug();
  buildSass();
}

// Execute the build process
buildAll();