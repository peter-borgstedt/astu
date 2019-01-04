import * as AWS from 'aws-sdk';

import { chalk, log } from '@common';
import * as awsUtils from '@common/aws';
import config from '@common/config';
import FMT from '@common/fmt';
import * as inquirer from 'inquirer';

export default (profile: any) => {
  profile = profile === 'string' && profile || config.properties.masterProfile;
  const profiles: any = awsUtils.getAWSCredentials();

  log.info(`Generate a temporary session token using profile: ${chalk.white(profile)}`);

  inquirer
    .prompt([
      {
        name: 'mfa_code',
        type: 'input',
        message: (answers: any) => `Enter MFA token (6 digits)`
      }
    ])
    .then((answers: any) => {
      profile = profile || answers.profile;

      AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile });
      const { mfa_serial } = profiles[profile];

      const params: AWS.STS.GetSessionTokenRequest = {
        DurationSeconds: 43200, // Token TTL set to 12 hours
        SerialNumber: mfa_serial, // MFA ARN
        TokenCode: answers.mfa_code // MFA code
      };

      new AWS.STS().getSessionToken(params).promise()
        .then((data: AWS.STS.GetSessionTokenResponse) => {
          const { Credentials } = data;
          const { AccessKeyId, SecretAccessKey, SessionToken } = Credentials as AWS.STS.Credentials;
          if (data.Credentials) {
            const credentials: any = {};

            credentials[`${profile}-temp`] = {
              aws_access_key_id: AccessKeyId,
              aws_secret_access_key: SecretAccessKey,
              aws_session_token: SessionToken
            };
            credentials['default'] = profiles[config.properties.masterProfile as string];
            awsUtils.updateCredentials(credentials);

            console.log(chalk.red(`\n\u2764 ${chalk.green(`Enabled temporary session for profile ${profile}-temp and setting ${config.properties.defaultProfile} as default profile`)}`));
            const fmt = new FMT();
            fmt.title(chalk.white('Summary'));
            fmt.field(chalk.green('access_key'), chalk.white(FMT.mask(AccessKeyId)));
            fmt.field(chalk.green('secret_key'), chalk.white(FMT.mask(SecretAccessKey)));
            fmt.field(chalk.green('region'), chalk.white(awsUtils.getRegion(profile)));
            fmt.separator();
          }
        }).catch(_error => {
          log.error('Invalid MFA code and/or serial id, not authenticated with MFA');
        });
    });
};
