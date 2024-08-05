const { program } = require('commander');
const { runCLI } = require('../src/cli');

program
  .version('1.0.0')
  .description('Analyze npm dependencies')
  .option('-p, --path <path>', 'Path to the project', process.cwd())
  .action((options) => {
    runCLI(options.path);
  });

program.parse(process.argv);