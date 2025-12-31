// Compatibility wrapper for environments that don't detect the flat `eslint.config.js`.
// Some CI runners and older integrations look for a traditional config file like
// `.eslintrc.*`. Re-export the flat config so both setups work.
module.exports = require('./eslint.config.js');
