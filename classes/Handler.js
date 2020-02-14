import shelljs from "shelljs";
import * as config from "./Config.js";

export default class Handler {
  checkConfigFile = config.checkConfigFile;

  createConfig = config.createConfig;

  updateConfig = config.updateConfig;

  readVaults() {}

  mountVault(vault) {}

  unmountVault(vault) {}
}
