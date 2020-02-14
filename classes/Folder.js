import shelljs from "shelljs";
import Lang from "./Lang.js"

export default class Folder {
  constructor(path) {
    let lang = Lang.get();
    if (!path) {
      throw new Error(lang.errors.folder);
    }
    this.path = path;
  }

  exists() {
    return shelljs.exec(`ls ${this.path}`, { silent: true }).code == 0;
  }

  isEmpty() {
    return shelljs.exec(`$(ls -A ${this.path})`, { silent: true }).code == 0;
  }
}
