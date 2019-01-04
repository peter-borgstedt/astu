import * as aws from '@common/aws';
import config from '@common/config';
import * as inquirer from 'inquirer';

enum Setting {
  MASTER_PROFILE,
  DEFAULT_PROFILE
}

const getCredentialProfiles = () => {
  const credentials = aws.getAWSCredentials();
  delete credentials.default;
  for (const key of Object.keys(credentials)) {
    if (key.endsWith('-temp')) {
      delete credentials[key];
    }
  }
  return Object.keys(credentials);
};

export default () => {
  const { defaultProfile, masterProfile } = config.properties;

  inquirer
  .prompt([
    {
      name: 'setting',
      type: 'list',
      message: `Select setting:`,
      choices: () => [
        { name: 'Master profile', value: Setting.MASTER_PROFILE },
        { name: 'Default profile', value: Setting.DEFAULT_PROFILE }
      ],
    },
    {
      name: 'masterProfile',
      type: 'list',
      message: `Select master profile (${masterProfile}):`,
      default: masterProfile,
      choices: () => getCredentialProfiles(),
      when: (answers: any) => answers.setting === Setting.MASTER_PROFILE
    },
    {
      name: 'defaultProfile',
      type: 'list',
      message: `Select default profile (${defaultProfile}):`,
      default: defaultProfile,
      choices: () => getCredentialProfiles(),
      when: (answers: any) => answers.setting === Setting.DEFAULT_PROFILE
    }
  ])
  .then((answers: any) => {
    if (answers.defaultProfile) {
      config.properties.defaultProfile = answers.defaultProfile;
    }

    if (answers.masterProfile) {
      config.properties.masterProfile = answers.masterProfile;
    }
    config.write();
  });
};
