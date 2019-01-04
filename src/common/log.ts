import { green, orange, red, white, yellow } from './chalk';

const info = (message: string) => {
  console.log(red(`\u2764 ${green(message)}`));
};
const warn = (message: string) => {
  console.log(orange(`\u272a ${message} \u272a`));
};
const error = (message: string) => {
  console.log(red(`\u0021\u0021 ${yellow(message)} \u0021\u0021`));
};

/**
 * Debug message that is only visible when you run the program with the -v or --verbose flag.
 * @param message any text message
 */
const debug = (message: any) => {
  if (process.env.VERBOSE) {
    console.log(`${white(message)}`);
  }
};

export { info, warn, error, debug };
