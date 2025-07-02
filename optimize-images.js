// optimize-images.js
// Node.js script to optimize all jpg, jpeg, png, and webp images in src/assets/images using imagemin and imagemin-webp

const imagemin = require("imagemin");
const imageminWebp = require("imagemin-webp");
const path = require("path");
const fs = require("fs");

const inputDir = path.join(__dirname, "src/assets/images");
const outputDir = path.join(inputDir, "optimized");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

(async () => {
  const files = [
    ...fs
      .readdirSync(inputDir)
      .filter((f) => f.match(/\.(jpg|jpeg|png|webp)$/i))
      .map((f) => path.join(inputDir, f)),
  ];
  if (files.length === 0) {
    console.log("No images found to optimize.");
    return;
  }
  const optimized = await imagemin(files, {
    destination: outputDir,
    plugins: [imageminWebp({ quality: 80 })],
  });
  console.log(`Optimized ${optimized.length} images. Output: ${outputDir}`);
})();
