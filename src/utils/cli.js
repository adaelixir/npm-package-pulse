import { program } from 'commander';
import { packagePulse } from '../index.js';

program
  .version('1.0.0')
  .description('Analyze npm dependencies')
  .option('-p, --path <path>', 'Path to the project', process.cwd())
  .action((options) => {
    const results = packagePulse(options.path);
    console.log(JSON.stringify(results, null, 2));
  });

program.parse(process.argv);