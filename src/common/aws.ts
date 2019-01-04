import * as AWS from 'aws-sdk';
import * as fs from 'fs';

import { IniFileContent, LoadFileOptions } from 'aws-sdk/lib/shared-ini/ini-loader';

interface IniLoader {
  loadFrom: (options?: LoadFileOptions) => IniFileContent;
  getDefaultFilePath: (isConfig: boolean) => string;
  getHomeDir: () => string;
}

const _AWSIniLoader = (new AWS.IniLoader() as unknown) as IniLoader;
export const getAWSCredentials = () => _AWSIniLoader.loadFrom();
export const getAWSConfig = () => _AWSIniLoader.loadFrom({ isConfig: true });
export const getAWSCredentialPath = () => _AWSIniLoader.getDefaultFilePath(false);
export const getAWSConfigPath = () => _AWSIniLoader.getDefaultFilePath(true);

export const getRegion = (profile: any) => {
  let region = AWS.config.region;
  if (region) {
    return region;
  }
  const config = getAWSConfig();
  const settings = config[profile] || config.default;
  return settings.region;
};

const writeToCredentials = (credentials: ICredentialProfile) => {
  let data = '';
  for (let id of Object.keys(credentials)) {
    data += `\n[${id}]`;
    const body: any = credentials[id];
    for (let key of Object.keys(body)) {
      data += `\n${key} = ${body[key]}`;
    }
    data += '\n';
  }
  fs.writeFileSync(getAWSCredentialPath(), data.trimLeft());
};

export const updateCredentials = (newOrUpdatedCredentials: ICredentialProfile[], defaultFirst = false) => {
  const existingCredentials = getAWSCredentials();

  const union: any = Object.assign(Object.assign({}, existingCredentials), newOrUpdatedCredentials);

  if (defaultFirst) {
    delete union.default;
  }

  const sections: any[] = Object.keys(union);
  if (defaultFirst) {
    sections.unshift('default');
  }

  const credentials: any = {};
  for (let section of sections) {
    const existing = existingCredentials[section];
    const updating = newOrUpdatedCredentials[section];

    if (existing && updating) {
      credentials[section] = Object.assign(existing, updating);
    } else {
      credentials[section] = existing || updating;
    }
  }

  writeToCredentials(credentials);
};
