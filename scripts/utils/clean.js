const rimraf = require('rimraf');

module.exports = function clean () {
  rimraf.sync('packages/**/build');
};
