const fs = require('fs');
const path = require('path');

try {
  const srcDir = path.join(__dirname, 'assets');
  const destDir = path.join(__dirname, 'public', 'assets');
  const imagesDestDir = path.join(__dirname, 'public', 'assets', 'images');
  fs.mkdirSync(imagesDestDir, { recursive: true });
  if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, destDir, { recursive: true });
  }

  const bethelemSrc = path.join(__dirname, 'assets', 'Bethelem mo.jpg');
  if (fs.existsSync(bethelemSrc)) {
    fs.copyFileSync(bethelemSrc, path.join(__dirname, 'assets', 'images', 'Bethelem mo.jpg'));
    fs.copyFileSync(bethelemSrc, path.join(__dirname, 'public', 'assets', 'images', 'Bethelem mo.jpg'));
  }
} catch (e) {
  console.error('Failed to sync assets:', e);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@lamed/shared', '@lamed/config'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'coresg-normal.trae.ai' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' }
    ]
  }
};

module.exports = nextConfig;


