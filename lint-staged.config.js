const path = require('path');

module.exports = {
  'client/**/*.{js,jsx,ts,tsx}': (filenames) => {
    const relativeFiles = filenames.map(f => `"${path.relative(path.join(process.cwd(), 'client'), f)}"`).join(' ');
    return [
      `npm run lint:staged --prefix client -- ${relativeFiles}`,
      `prettier --write ${filenames.map(f => `"${f}"`).join(' ')}`
    ];
  },
  'server/**/*.js': (filenames) => {
    const relativeFiles = filenames.map(f => `"${path.relative(path.join(process.cwd(), 'server'), f)}"`).join(' ');
    return [
      `npm run lint:staged --prefix server -- ${relativeFiles}`,
      `prettier --write ${filenames.map(f => `"${f}"`).join(' ')}`
    ];
  }
};
