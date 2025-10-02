// Load environment variables from .env so EXPO_PUBLIC_* values are embedded
// into the bundle at build/start time.
module.exports = ({ config }) => {
  try {
    // eslint-disable-next-line global-require
    require('dotenv').config();
  } catch (e) {
    // no-op if dotenv is not installed
  }
  return config;
};


