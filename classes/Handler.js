import shelljs from "shelljs";
import Folder from "./Folder.js";

export default class Handler {
  readVaults() {
    let vaults = new Folder(global.config.vaultsPath);
    if (vaults.exists()) {
      if(!vaults.isEmpty()){
        vaults.getContent()
      }else{
        throw new Error(global.lang.errors.vaultsDirectoryEmpty);
      }
    } else {
      throw new Error(global.lang.errors.vaultsDirectoryInvalid);
    }
  }

  mountVault(vault) {}

  unmountVault(vault) {}
}
