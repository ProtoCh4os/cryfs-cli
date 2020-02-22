import fs from "fs";

export default class Folder {
  constructor(path) {
    if (!path) {
      throw new Error(global.lang.errors.folder);
    }
    this.path = path;
  }

  exists() {
    return fs.lstatSync(`${this.path}`).isDirectory();
  }

  isEmpty() {
    return fs.readdir(this.path, function(err, files) {
      return !files.length;
    });
  }

  getContent() {
    if (this.isEmpty()) {
      return false;
    }

    return fs.readdir(path, function(err, items) {
      return items;
    });
  }
}
