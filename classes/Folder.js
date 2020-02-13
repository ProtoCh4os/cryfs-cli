import shelljs from "shelljs";

export default class Folder {
  constructor(path) {
    if (!path) {
      throw new Error("Folder must have a path");
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
