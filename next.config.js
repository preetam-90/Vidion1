/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'i.ytimg.com',
      'i.postimg.cc',
      'drive.google.com',
      'lh3.googleusercontent.com',
      'yt3.ggpht.com',
      'img.youtube.com',
      'image.tmdb.org'
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  }
};

module.exports = nextConfig;
