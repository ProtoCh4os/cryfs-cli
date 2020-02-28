import fs from "fs";

export default class Folder {
  constructor(path) {
    if (!path) {
      throw new Error(global.lang.errors.folder);
    }
    this.path = path;
  }

  exists(alsoDirectory = true) {
    return (
      fs.existsSync(this.path) &&
      ((alsoDirectory && this.isDirectory) || !alsoDirectory)
    );
  }

  isDirectory() {
    fs.lstatSync(this.path).isDirectory();
  }

  isEmpty() {
    return !fs.readdirSync(this.path).length;
  }

  createSymb(to) {
    return fs.symlinkSync(to, `${this.path}`);
  }

  getContent() {
    if (this.isEmpty()) {
      return false;
    }

    return fs.readdirSync(this.path);
  }

  create() {
    if (!this.exists()) {
      return fs.mkdirSync(this.path, { recursive: true }, err => {
        if (err) {
          return false;
        }
        return true;
      });
    }
  }
}
