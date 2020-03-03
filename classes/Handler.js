import shelljs from "shelljs";
import Folder from "./Folder.js";

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

  async mountVault(vault, password) {
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

    const mounting = shelljs.exec(
      `echo ${password} | cryfs ${from.path} ${to.path}`,
      { silent: true }
    );

    switch (mounting.code) {
      case 0:
        const link = new Folder(`${process.env.HOME}/${vault}`);
        if (
          (link.exists(false) && !link.isDirectory()) ||
          !global.config.placeSymLinks
        ) {
          return { success: true, msg: global.lang.open.success };
        } else {
          link.createSymb(`${global.config.mountingPath}/${vault}`);
          return {
            success: true,
            msg: `${global.lang.open.success} ${global.lang.open.linkPlaced}`
          };
        }
        break;

      case 11:
        return { success: false, msg: global.lang.errors.incorrectPassword };
        break;

      default:
        return { success: false, msg: global.lang.errors.unknown };
        break;
    }
  }

  async unmountVault(vault) {
    var folder = new Folder(`${global.config.mountingPath}/${vault}`);
    var removeSyml = false;
    if (global.config.placeSymLinks) {
      var syml = new Folder(`${process.env.HOME}/${vault}`);
      if (syml.exists(false) && syml.isMounted()) {
        removeSyml = true;
      }
    }
    if (folder.exists() && folder.isMounted()) {
      let unmount = shelljs.exec(`cryfs-unmount ${folder.getRealPath()}`, {
        silent: true,
        async: false
      });
      if (unmount.code == 0) {
        if (removeSyml) {
          syml.delete();
        }
        return { success: true, msg: global.lang.close.success };
      } else {
        return { success: false, msg: unmount };
      }
    } else {
      return { success: false, msg: global.lang.errors.generic };
    }
  }

  getMountedVaults() {
    var vaults = this.readVaults();
    if (Array.isArray(vaults) && vaults.length > 0) {
      return vaults.filter(path => {
        return new Folder(`${global.config.vaultsPath}/${path}`).isMounted();
      });
    }
    return false;
  }
}
