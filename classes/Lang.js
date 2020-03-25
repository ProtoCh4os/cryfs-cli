import shelljs from "shelljs";
import Path from "path";
import fs from 'fs';
import { get as getConfig } from "./Config.js"

export const langs = ["en_us"];

export async function get (lang = "") {
  if(!lang){
    lang = await getConfig();
  }

  let path = Path.resolve(Path.dirname(''))
  
  if (langs.includes(lang)) {
    var langFile = fs.readFileSync(`${path}/lang/${lang}.json`,'utf8');
  } else {
    var langFile = fs.readFileSync(`${path}/lang/en_us.json`,'utf8');
  }
  try{
    return JSON.parse(langFile);
  } catch(e){
    return false;
  }
}

export async function set() {
  global.lang = await get();
  return global.lang;
}
