import shelljs from "shelljs";
import Folder from "./Folder.js";
import fs from "fs";

export default class Handler {
  constructor() {
    this.settings = {
      introduction: true,
      vaultsPath: "/var/lib/cryfs-cli/",
      lang: "en_us"
    };
  }

  checkConfigFile() {
    var settings = shelljs.exec(
      `cat ${process.env.HOME}/.config/cryfs-cli/settings.json`,
      { silent: true }
    );
    if (settings.code == 0) {
      fs.readFileSync(
        `${process.env.HOME}/.config/cryfs-cli/settings.json`,
        (err, data) => {
          if (err) {
            return;
          }
          return JSON.parse(data);
        }
      );
    } else {
      return false;
    }
  }

  createConfig() {
    if (this.checkConfigFile() === false) {
      if (
        shelljs.exec(`ls ${process.env.HOME}/.config/cryfs-cli`, {
          silent: true
        }).code != 0
      ) {
        shelljs.exec(`mkdir -p ${process.env.HOME}/.config/cryfs-cli`, {
          silent: true
        });
      }

      if (
        shelljs.exec(
          `cat ${process.env.HOME}/.config/cryfs-cli/settings.json`,
          { silent: true }
        ).code != 0
      ) {
        let settings = JSON.stringify(this.settings);
        shelljs.exec(
          `echo "${settings}" >> ${process.env.HOME}/.config/cryfs-cli/settings.json`,
          { silent: true }
        );
      }
      return true;
    }
    return false;
  }

  updateConfig(settings = false) {
    if (this.checkConfigFile) {
      if (settings !== false && typeof settings === 'object'){
        this.settings = {...this.settings, settings};
      }
      settings = JSON.stringify(this.settings);
      shelljs.exec(
        `echo "${settings}" > ${process.env.HOME}/.config/cryfs-cli/settings.json`,
        { silent: true }
      );
      return true;
    }
    return false;
  }

  readVaults() {}

  mountVault(vault) {}

  unmountVault(vault) {}
}
