import shelljs from "shelljs";
import Folder from "./Folder.js";
import ora from "ora";

export default class Handler {
  readVaults() {
    let vaults = new Folder(global.config.vaultsPath);
    if (vaults.exists()) {
      if (!vaults.isEmpty()) {
        return vaults.getContent();
      } else {
        throw new Error(global.lang.errors.vaultsDirectoryEmpty);
      }
    } else {
      throw new Error(global.lang.errors.vaultsDirectoryInvalid);
    }
  }

  readOpenVaults(markOpenVaults = false) {
    if (markOpenVaults) {
      return this.readVaults().map(vault => {
        let folder = new Folder(`${global.config.vaultsPath}/${vault}`);
        if (folder.isMounted()) {
          return `${vault} (${global.lang.mounted})`;
        }
        return vault;
      });
    } else {
      var vaults = this.readVaults();
      if (Array.isArray(vaults) && vaults.length > 0) {
        return vaults.filter(path => {
          return new Folder(`${global.config.vaultsPath}/${path}`).isMounted();
        });
      }
      return false;
    }
  }

  async mountVault(vault, password, callback) {
    const from = new Folder(`${global.config.vaultsPath}/${vault}`);
    const to = new Folder(`${global.config.mountingPath}/${vault}`);

    if (!from.exists()) {
      return { success: false, msg: global.lang.errors.vaultsDirectoryInvalid };
    }

    if (from.isMounted()) {
      return { success: false, msg: global.lang.errors.vaultAlreadyMounted };
    }

    if (!to.exists()) {
      to.create();
    }

    if (!to.isEmpty()) {
      return { success: false, msg: global.lang.errors.mountingNotEmpty };
    }

    const loading = ora(global.lang.loading).start();

    shelljs.exec(
      `echo ${password} | cryfs ${from.path} ${to.path}`,
      {
        silent: true
      },
      async code => {
        loading.stop();
        var result = { success: true, msg: global.lang.errors.unknown };
        switch (code) {
          case 0:
            const link = new Folder(`${process.env.HOME}/${vault}`);
            if (
              (link.exists(false) && !link.isDirectory()) ||
              !global.config.placeSymLinks
            ) {
              result = { success: true, msg: global.lang.open.success };
            } else {
              link.createSymb(`${global.config.mountingPath}/${vault}`);
              result = {
                success: true,
                msg: `${global.lang.open.success} ${global.lang.open.linkPlaced}`
              };
            }
            break;

          case 11:
            result = {
              success: false,
              msg: global.lang.errors.incorrectPassword
            };
            break;

          default:
            result = { success: false, msg: global.lang.errors.unknown };
            break;
        }
        callback(result);
      }
    );
  }

  async unmountVault(vault, callback) {
    const loading = ora(global.lang.loading).start();

    var folder = new Folder(`${global.config.mountingPath}/${vault}`);
    var origin = new Folder(`${global.config.vaultsPath}/${vault}`);
    var removeSyml = false;
    if (global.config.placeSymLinks) {
      var syml = new Folder(`${process.env.HOME}/${vault}`);
      if (syml.exists(false) && syml.isMounted()) {
        removeSyml = true;
      }
    }
    if (folder.isMounted() && origin.isMounted()) {
      shelljs.exec(
        `cryfs-unmount ${folder.getRealPath()}`,
        {
          silent: true
        },
        code => {
          loading.stop();
          if (code == 0) {
            if (removeSyml) {
              syml.delete();
            }
            callback({ success: true, msg: global.lang.close.success });
          } else {
            callback({ success: false, msg: global.lang.error.generic });
          }
        }
      );
    } else {
      if (!folder.isMounted() && origin.isMounted()) {
        let info = new Folder("/etc/mtab")
          .readFile()
          .split(`cryfs@${origin.getRealPath()}`);
        info.shift();
        if (info.length > 0) {
          info = info.shift();
          if (info[0] === "/") {
            info = info.substring(1, info.length);
          }
          info = info.trim();
          info = info.split(" ").shift();
          shelljs.exec(
            `cryfs-unmount ${info}`,
            {
              silent: true
            },
            code => {
              loading.stop();
              if (code == 0) {
                if (removeSyml) {
                  syml.delete();
                }
                callback({ success: true, msg: global.lang.close.success });
              } else {
                callback({ success: false, msg: global.lang.error.generic });
              }
            }
          );
        } else {
          loading.stop();
          callback({ success: false, msg: global.lang.errors.unknown });
        }
      } else {
        callback({ success: false, msg: global.lang.errors.generic });
      }
    }
  }

  createVault(name, password, callback) {
    const vault = new Folder(`${global.config.vaultsPath}/${name}`);
    var tmpName =
      [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join("") +
      "/";
    const tmpFolder = new Folder("/tmp/" + name + tmpName);

    let i = 0;
    while (tmpFolder.exists()) {
      tmpName =
        [...Array(30)]
          .map(i => (~~(Math.random() * 36)).toString(36))
          .join("") + "/";
      tmpFolder = new Folder("/tmp/" + name + tmpName);
      if (i++ > 10) {
        callback({ success: false, msg: global.lang.error.generic });
      }
    }

    if (vault.exists()) {
      callback({ success: false, msg: global.lang.errors.mountingNotEmpty });
    }

    vault.create();
    tmpFolder.create();

    const loading = ora(global.lang.loading).start();

    shelljs.exec(
      `echo ${password} | cryfs ${vault.path} ${tmpFolder.path}`,
      {
        silent: true
      },
      (code, stout, err) => {
        tmpFolder.deletedir();
        loading.stop();
        switch (code) {
          case 0:
            this.unmountVault(name, res => {
              if (res.success) {
                callback({ success: true, msg: global.lang.create.success });
              } else {
                callback(res);
              }
            });
            break;

          default:
            callback({ success: false, msg: global.lang.errors.unknown });
            break;
        }
      }
    );
  }

  removeVault(vault, callback) {
    const folder = new Folder(`${global.config.vaultsPath}/${vault}`);
    const loading = ora(global.lang.loading).start();
    const resolve = res => {
      folder.deletedir(true);
      loading.stop();
      callback(res);
    };

    if (folder.isMounted()) {
      this.unmountVault(vault, res => {
        if (res.success) {
          resolve({ success: true, msg: global.lang.remove.success });
        } else {
          resolve(res);
        }
      });
    } else {
      resolve({ success: true, msg: global.lang.remove.success });
    }
  }
}
