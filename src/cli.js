const { analyzeDependencies } = require('./index');

function runCLI(dir) {
    const results = analyzeDependencies(dir);
    console.log(JSON.stringify(results, null, 2));
  }
  
  module.exports = { runCLI };