import fs from "fs";

export default class Folder {
  constructor(path) {
    if (!path) {
      throw new Error(global.lang.errors.folder);
    }
    this.path = path;
  }

  exists() {
    return fs.existsSync(this.path) && fs.lstatSync(this.path).isDirectory();
  }

  isEmpty() {
    return fs.readdir(this.path, function(err, files) {
      if (err) {
        return false;
      }
      return !files.length;
    });
  }

  getContent() {
    if (this.isEmpty()) {
      return false;
    }

    return fs.readdir(path, function(err, items) {
      if (err) {
        return false;
      }
      return items;
    });
  }

  create() {
    if (!this.exists()) {
      return fs.mkdir(this.path, { recursive: true }, err => {
        if (err) {
          return false;
        }
        return true;
      });
    }
  }
}
