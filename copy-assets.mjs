import fs from 'fs';
import path from 'path';

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

console.log("Memulai proses penyalinan aset statis untuk LiteSpeed Hostinger...");

// 1. Copy ke _next/static (Untuk Document Root standar)
const dest1 = path.join('_next', 'static');
console.log(`Menyalin ke ${dest1}...`);
copyRecursiveSync(path.join('.next', 'static'), dest1);

// 2. Copy ke public/_next/static (Untuk Document Root public)
const dest2 = path.join('public', '_next', 'static');
console.log(`Menyalin ke ${dest2}...`);
copyRecursiveSync(path.join('.next', 'static'), dest2);

console.log("Menyalin selesai!");
