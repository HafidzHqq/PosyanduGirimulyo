process.env.NODE_ENV = 'production';
const cli = require('next/dist/cli/next-start');
cli.nextStart(['-p', process.env.PORT || '3000']);
