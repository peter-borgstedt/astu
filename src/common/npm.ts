import { spawnSync } from 'child_process';
import pkg from 'package.json';

const parseVersion = (version: string): { str: string, num: number} => {
  version = version.trim().replace(/[,\s]/g, '.'); // Corrections
  const obj: any = { str: version };
  const decimal = version.indexOf('.');
  if (decimal) {
    const characteristic = version.substr(0, decimal);
    const mantissa = version.substr(decimal, version.length).replace(/[.,\s]/g, '');
    obj.num = parseFloat(`${characteristic}.${mantissa}`);
  } else {
    obj.num = +version;
  }
  return obj;
};

export const getPrecision = (a: number) => {
  if (!isFinite(a)) {
    return 0;
  }

  let e = 1, p = 0;
  while (Math.round(a * e) / e !== a) {
    e *= 10;
    p++;
  }
  return p;
};

const getLatestVersion = (packageId: string): string => {
  const spawn = spawnSync('npm', ['show', packageId, 'version'], { encoding : 'utf8' });
  return spawn.stdout.trim();
};

export const isPackageGloballyInstalled = (packageId: string) => {
  const spawn = spawnSync('npm', ['list', '--depth', '0', '-g', packageId], { encoding: 'utf8' });
  const output: string = spawn.stdout;
  const [ /* path */, packageNode ] = output.trim().split('\n');
  return packageNode.indexOf(packageId) !== -1;
};

export const getPackageVersion = () => {
  const current = parseVersion(pkg.version.trim());
  const latest = parseVersion(getLatestVersion(pkg.name));
  return { current, latest };
};
