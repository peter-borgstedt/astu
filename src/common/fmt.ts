export default class FMT {
  public static mask (value: string, mask = '*', offset = 4) {
    const from = Math.min(0, Math.max(value.length, value.length - offset));
    return new Array(16).join(mask) + value.substr(from, value.length);
  }

  private static stripANSI(str: string) {
    return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
  }

  private static pad(str: string, indent: number, left = true, separator = ' ') {
    const length = FMT.stripANSI(str).length;
    const space = new Array(Math.max(0, indent - length)).join(separator);
    return left ? str + space : space + str;
  }

  constructor(private width = 50) {}

  public title(title: string) {
    const pTitle = `---- ${title} `;
    const line = FMT.pad(pTitle, this.width, true, '-');
    console.log(`${line}`);
  }

  public separator(separator = '-', length = this.width) {
    console.log(new Array(length).join(separator));
  }

  public NL() {
    console.log('\n');
  }

  public field(name: string, value: string) {
    const pName = FMT.pad(name, (this.width / 2) - 1, false);
    const pValue = FMT.pad(value, (this.width / 2) - 1);
    console.log(`${pName} : ${pValue}`);
  }
}
