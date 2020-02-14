import shelljs from "shelljs";
import { settings } from './Config.js'
import Path from "path";

const langs = ["en_us"];

function get (lang = "") {
  if(!lang){
    lang = settings.lang
  }
  let path = import.meta.url.substring(7, import.meta.url.length);
  path = Path.dirname(path);
  if (langs.includes(lang)) {
    var cmd = shelljs.exec(`cat ${path}/../lang/${lang}.json`, {
      silent: true
    });
  } else {
    var cmd = shelljs.exec(`cat ${path}/../lang/en_us.json`, {
      silent: true
    });
  }
  if (cmd.code == 0) {
    return JSON.parse(cmd.stdout);
  }
  return false;
}

export default {
  get,
  langs
}
