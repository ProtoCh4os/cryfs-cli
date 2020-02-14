import shelljs from "shelljs";
import fs from "fs";

export var settings = checkConfigFile()
  ? checkConfigFile()
  : {
      introduction: true,
      vaultsPath: "/var/lib/cryfs-cli/",
      mountingPath: "/var/lib/cryfs-cli/open/",
      lang: "en_us"
    };

export function checkConfigFile() {
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

export function createConfig() {
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
      shelljs.exec(`cat ${process.env.HOME}/.config/cryfs-cli/settings.json`, {
        silent: true
      }).code != 0
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

export function updateConfig(settings = false) {
  if (this.checkConfigFile) {
    if (settings !== false && typeof settings === "object") {
      this.settings = { ...this.settings, settings };
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
