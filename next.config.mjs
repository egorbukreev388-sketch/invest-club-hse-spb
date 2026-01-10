/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Опционально: если нужны дополнительные настройки webpack для алиасов
  // webpack: (config) => {
  //   return config;
  // },
}

export default nextConfig;
