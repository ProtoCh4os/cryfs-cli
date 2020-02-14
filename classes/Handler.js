import shelljs from "shelljs";
import * as config from "./Config.js";
import Folder from "./Folder.js";

export default class Handler {
  constructor() {
    this.settings = config.settings;
  }

  checkConfigFile = config.checkConfigFile;

  createConfig = config.createConfig;

  updateConfig = config.updateConfig;

  readVaults() {}

  mountVault(vault) {}

  unmountVault(vault) {}
}
