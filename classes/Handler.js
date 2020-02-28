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
        if (link.exists(false) && !link.isDirectory()) {
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

  async unmountVault(vault) {}
}
