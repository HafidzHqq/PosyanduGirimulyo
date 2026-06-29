import('next/dist/cli/next-start.js').then(({ nextStart }) => {
  process.env.NODE_ENV = 'production';
  nextStart(['-p', process.env.PORT || '3000']);
});
