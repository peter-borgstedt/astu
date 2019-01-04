import { blue, green, red, white, yellow } from '@common/chalk';
import * as log from '@common/log';
import { spawn } from 'child_process';
import ora from 'ora';

const messages = [
  'hold on to your hat, this will get speedy...',
  `the wind is blowing, your mind is glowing...`,
  'do you got a steady hand on that bowler hat of yours',
  `uhm... the wind that blew was just a breeze of air...`,
  `so what are your plans for the coming vacation? `,
  `i think you can put on your hat again...`,
  `somethings taking a long time...`,
];

const colors = [blue, green, red, white, yellow];

export default async (_cmd: any, _options: any) => {
  log.info(`Updating ASTU, please wait couple of seconds...`);
  const child = spawn('npm', ['install', 'astu', '-g']);

  const getText = () => {
    const color = colors[Math.floor(colors.length * Math.random())];
    return color(messages[Math.floor(messages.length * Math.random())]);
  };
  const spinner = ora({ color: 'yellow' }).start();
  setInterval(() => spinner.text = getText(), Math.floor(Math.random() * Math.floor(6) * 1000) + 2000);

  child.stdout.on('data', data => console.log(`\n${data}`));
  child.stderr.on('data', data => console.error(`\n${data}`));

  child.on('exit', (_code, _signal) => {
    spinner.stop();
    log.info(`Any one ordered a vesiuvio? - ASTU update complete!`);
    process.exit(0);
  });
};
