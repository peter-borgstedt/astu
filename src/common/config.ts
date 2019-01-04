import * as fs from 'fs';
import * as os from 'os';

class Config {
  private static CONFIG_PATH = `${os.homedir()}/.astu-config`;
  public properties: IProperties = {};

  constructor() {
    this.read();
  }

  public write() {
    fs.writeFileSync(Config.CONFIG_PATH, JSON.stringify(this.properties));
  }

  private read() {
    if (fs.existsSync(Config.CONFIG_PATH)) {
      this.properties = JSON.parse(fs.readFileSync(Config.CONFIG_PATH).toString());
    }
  }
}

export default new Config();
