import fs from 'fs';
import path from 'path';

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(file => {
      copyRecursiveSync(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log("Menyalin folder .next/static ke dalam .next/standalone/.next/static (Untuk Node.js)...");
copyRecursiveSync(path.join('.next', 'static'), path.join('.next', 'standalone', '.next', 'static'));

console.log("Menyalin folder .next/static ke dalam .next/standalone/public/_next/static (Untuk Hostinger LiteSpeed)...");
copyRecursiveSync(path.join('.next', 'static'), path.join('.next', 'standalone', 'public', '_next', 'static'));

console.log("Menyalin folder public ke dalam .next/standalone/public...");
copyRecursiveSync('public', path.join('.next', 'standalone', 'public'));

console.log("Berhasil menyalin file statis untuk deployment Hostinger!");
