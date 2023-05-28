// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

import withPWA from 'next-pwa'
 
//const isProduction = process.env.NODE_ENV === 'production';

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },};

const nextConfig = withPWA({
  dest: 'public',
  //disable: !isProduction,
  //runtimeCaching
})(
  config
);

export default nextConfig;
