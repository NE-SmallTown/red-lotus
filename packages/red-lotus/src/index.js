const {
  REDLOTUS_FILE_TYPE,
  REDLOTUS_CONTENT_TYPE,
} = require('../../shared/RedLotusTags');

const sharedComponentTypes = {
  File: REDLOTUS_FILE_TYPE,
  Content: REDLOTUS_CONTENT_TYPE,
};

if (typeof window !== 'undefined') {
  module.exports = {
    ...require('red-lotus-dom/src'),
    ...sharedComponentTypes,
  };
} else {
  module.exports = {
    ...require('red-lotus-dom-server/src'),
    ...sharedComponentTypes,
  };
}
