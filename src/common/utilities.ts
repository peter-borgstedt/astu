import os from 'os';

export const getHomeDir = () => {
  const env = process.env;
  const home = env.HOME || env.USERPROFILE || (env.HOMEPATH ? ((env.HOMEDRIVE || 'C:/') + env.HOMEPATH) : null);

  if (home) {
    return home;
  }

  if (typeof os.homedir === 'function') {
    return os.homedir();
  }

  throw new Error('Cannot not find HOME path');
};
