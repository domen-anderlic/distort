/** @type {import('next').NextConfig} */
module.exports = {
    images: {
        domains: ['ucarecdn.com'],
        remotePatterns: [
            {protocol: 'https', hostname: 'ucarecdn.com', pathname: '**',},
        ],
    }
}
