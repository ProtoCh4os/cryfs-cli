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

  delete() {
    if (this.exists(false)) {
      return this.isDirectory()
        ? this.deletedir()
        : fs.unlinkSync(this.path);
    }
    return false;
  }

  deletedir(){
    fs.rmdirSync(this.path)
  }

  getContent() {
    if (this.isEmpty()) {
      return false;
    }

    return fs.readdirSync(this.path);
  }

  readFile() {
    if (this.exists(false) && !this.isDirectory()) {
      return fs.readFileSync(this.path, "utf8");
    }
    return false;
  }

  isMounted() {
    let mtab = new Folder("/etc/mtab");
    return mtab.readFile().includes(this.getRealPath());
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
    return false;
  }

  getRealPath() {
    if (this.exists()) {
      return fs.realpathSync(this.path);
    }
  }
}
