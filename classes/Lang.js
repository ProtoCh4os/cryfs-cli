import shelljs from "shelljs";
import Path from "path";

const langs = ["en_us"];

export default function(lang) {
  let path = import.meta.url.substring(7, import.meta.url.length);
  path = Path.dirname(path);
  if (langs.includes(lang)) {
    let cmd = shelljs.exec(`cat ${path}/../lang/${lang}.json`, {
      silent: true
    });
    if (cmd.code == 0) {
      return JSON.parse(cmd.stdout);
    }
    return false;
  }
  return false;
}
