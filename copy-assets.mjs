const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(file => {
      copyRecursiveSync(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log("Menyalin public folder...");
copyRecursiveSync('public', path.join('.next', 'standalone', 'public'));

console.log("Menyalin .next/static untuk Node.js internal server...");
copyRecursiveSync(path.join('.next', 'static'), path.join('.next', 'standalone', '.next', 'static'));

console.log("Menyalin .next/static untuk LiteSpeed (Root Document)...");
copyRecursiveSync(path.join('.next', 'static'), path.join('.next', 'standalone', '_next', 'static'));

console.log("Menyalin .next/static untuk LiteSpeed (Public Document)...");
copyRecursiveSync(path.join('.next', 'static'), path.join('.next', 'standalone', 'public', '_next', 'static'));

console.log("Menyalin selesai!");
