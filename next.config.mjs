/** @type {import("next").NextConfig} */
const config = {
    experimental: {
        instrumentationHook: true,
      },
      images: {
        domains: ['i.ytimg.com'],
      }
};

export default config;
