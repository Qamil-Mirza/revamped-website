// Simple Node script (no TS types at runtime) to generate
// a manifest of travel photos from `public/travels`.
const fs = require("fs");
const path = require("path");

const TRAVELS_ROOT = path.join(process.cwd(), "public", "travels");
const OUTPUT_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "travel-manifest.json"
);

function isDirectory(fullPath) {
  try {
    return fs.statSync(fullPath).isDirectory();
  } catch {
    return false;
  }
}

function getImageFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir);
  return entries.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
  });
}

function generateManifest() {
  const manifest = {};

  if (!fs.existsSync(TRAVELS_ROOT)) {
    return manifest;
  }

  const countrySlugs = fs.readdirSync(TRAVELS_ROOT).filter((entry) =>
    isDirectory(path.join(TRAVELS_ROOT, entry))
  );

  for (const countrySlug of countrySlugs) {
    const countryPath = path.join(TRAVELS_ROOT, countrySlug);
    const citySlugs = fs
      .readdirSync(countryPath)
      .filter((entry) => isDirectory(path.join(countryPath, entry)));

    manifest[countrySlug] = {};

    for (const citySlug of citySlugs) {
      const cityPath = path.join(countryPath, citySlug);
      const images = getImageFiles(cityPath).map((file) =>
        path.join("/travels", countrySlug, citySlug, file).replace(/\\/g, "/")
      );

      manifest[countrySlug][citySlug] = images;
    }
  }

  return manifest;
}

function main() {
  const manifest = generateManifest();

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Travel manifest written to ${OUTPUT_PATH}`);
}

main();

