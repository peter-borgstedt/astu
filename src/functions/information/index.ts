import { chalk } from '@common';
import * as awsUtils from '@common/aws';
import config from '@common/config';
import FMT from '@common/fmt';

export default(): void => {
  const fmt = new FMT(80);
  fmt.title(chalk.white('Details'));
  fmt.field(chalk.green('config_path'), chalk.white(awsUtils.getAWSConfigPath()));
  fmt.field(chalk.green('credential_path'), chalk.white(awsUtils.getAWSCredentialPath()));
  fmt.field(chalk.green('master_profile'), config.properties.masterProfile as string);
  fmt.field(chalk.green('default_profile'), config.properties.defaultProfile as string);
  fmt.separator();
};
