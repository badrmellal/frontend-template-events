/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com'
        },
        {
          protocol: 'https',
          hostname: 'i.postimg.cc'
        },
        {
          protocol: 'https',
          hostname: 'images.pexels.com'
        },
        {
          protocol: 'https',
          hostname: 'cdn.pixabay.com'
        },
        {
          protocol: 'https',
          hostname: 'africa-events.s3.eu-west-3.amazonaws.com'
        }
      ]
    }
  };
  
  export default nextConfig;