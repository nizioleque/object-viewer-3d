const ThreadsPlugin = require('threads-plugin');

module.exports = {
  babel: {
    presets: [],
    plugins: [],
  },
  typescript: {
    enableTypeChecking: true,
  },
  webpack: {
    alias: {},
    plugins: {
      add: [new ThreadsPlugin()],
      remove: [],
    },
  },
};
