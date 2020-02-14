import shelljs from "shelljs";
import Path from "path";
import { get as getConfig } from "./Config.js"

export const langs = ["en_us"];

export async function get (lang = "") {
  if(!lang){
    lang = await getConfig();
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

export async function set() {
  global.lang = await get();
  return global.lang;
}
