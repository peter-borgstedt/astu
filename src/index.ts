#!/usr/bin/env node

import { chalk, log } from '@common';
import { getPackageVersion, getPrecision } from '@common/npm';
import { configure, generate, information } from '@functions';
import program from 'commander';
import { textSync } from 'figlet';
import pkg from 'package.json';

const checkVersion = (): void => {
  const { current, latest } = getPackageVersion();
  const precision = Math.max(getPrecision(current.num), getPrecision(latest.num));

  if (current.num < latest.num) {
    console.log(chalk.pink(`Running ${chalk.white(`v${current.num.toFixed(precision)}`)}, latest is ${chalk.white(`v${latest.num.toFixed(precision)}`)}. Run: ${chalk.white('\'astu update\'')} to upgrade.`));
  }
};

program
  .version(pkg.version)
  .description(chalk.cyan(textSync('ASTU', { font: 'Modular' })) + '\n\r' + chalk.yellow(`A utility for AWS security tokens`))
  .option('-v, --verbose', 'Add this to any command to see more detailed info.');

program
  .command('generate')
  .alias('g')
  .description(chalk.yellow('Generate a temporary token'))
  .action(generate);

program
  .command('information')
  .alias('i')
  .description(chalk.yellow('Information of current environment and settings'))
  .action(information);

program
  .command('setup')
  .alias('s')
  .description(chalk.yellow('Setup'))
  .action(configure);

program
  .command('update')
  .alias('u')
  .description(chalk.yellow('Update'))
  .action(configure);

program.on('command:*', () => {
  log.error(`Invalid command: ${program.args.join(' ')}\nSee --help for a list of available commands.`);
  process.exit(1);
});

program.on('option:verbose', function (this: any) {
  process.env.VERBOSE = this.verbose;
});

checkVersion();

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
