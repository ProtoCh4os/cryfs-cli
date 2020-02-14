import shelljs from "shelljs";

const defaultConfig = {
  introduction: true,
  vaultsPath: "/var/lib/cryfs-cli/",
  mountingPath: "/var/lib/cryfs-cli/open/",
  lang: "en_us"
};

export async function get() {
  return await checkConfigFile();
}

export async function set() {
  global.config = await checkConfigFile();
}

export async function checkConfigFile() {
  var opt = shelljs.exec(
    `cat ${process.env.HOME}/.config/cryfs-cli/settings.json`,
    { silent: true }
  );
  if (opt.code == 0) {
    try {
      var json = JSON.parse(opt.stdout);
      return json;
    } catch (e) {
      return defaultConfig;
    }
  } else {
    return false;
  }
}

export async function createConfig(force = false) {
  if (checkConfigFile() === false || force) {
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
      let settings = JSON.stringify(settings);
      shelljs.exec(
        `echo "${settings}" >> ${process.env.HOME}/.config/cryfs-cli/settings.json`,
        { silent: true }
      );
    }
    return true;
  }
  return false;
}

export async function updateConfig(payload = false) {
  let settings = await checkConfigFile();
  if (settings) {
    if (payload !== false && typeof payload === "object") {
      settings = { ...settings, ...payload };
    }
    global.config = settings;

    return (
      shelljs.exec(
        `echo '${JSON.stringify(settings)}' > ${
          process.env.HOME
        }/.config/cryfs-cli/settings.json`,
        { silent: true }
      ).code == 0
    );
  }
}
