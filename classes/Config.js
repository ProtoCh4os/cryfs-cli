import fs from "fs";
import Folder from "./Folder.js";

const defaultFolder = `${process.env.HOME}/.config/cryfs-cli`;
const configPath = `${defaultFolder}/settings.json`;

const defaultConfig = {
  introduction: true,
  vaultsPath: `${defaultFolder}/closed`,
  mountingPath: `${defaultFolder}/open`,
  placeSymLinks: true,
  lang: "en_us"
};

export async function get() {
  let val = await checkConfigFile();
  if (!val) {
    val = defaultConfig;
    await createConfig(true);
  }
  return val;
}

export async function set() {
  global.config = await get();
}

export async function checkConfigFile() {
  return new Promise((res, rej) =>
    fs.readFile(
      configPath,
      "utf8",
      (err, data) => {
        if (err) {
          res(false);
        } else {
          try {
            res(JSON.parse(data));
          } catch (e) {
            rej(false);
          }
        }
      }
    )
  );
}

export async function createConfig(force = false) {
  if (checkConfigFile() === false || force) {
    var configFile = new Folder(`${process.env.HOME}/.config/cryfs-cli`);

    if (!configFile.exists()) {
      configFile.create();
    }

    return fs.readFile(
      configPath,
      "utf8",
      err => {
        if (err || force) {
          get()
            .then(content => {
              return fs.writeFile(
                configPath,
                JSON.stringify(content),
                "utf8",
                err => !err
              );
            })
            .catch(err => false);
          return;
        }
        return false;
      }
    );
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
    return fs.writeFile(
      configPath,
      JSON.stringify(settings),
      "utf8",
      err => !err
    );
  }
}
