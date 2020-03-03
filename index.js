#!/usr/bin/env -S node --no-warnings

import shelljs from "shelljs";
import { startUp } from "./menus/main.js";
import { set as config } from "./classes/Config.js";
import { set as lang } from "./classes/Lang.js";

(async () => {
  try {
    await config();
    await lang();
    if (shelljs.exec("cryfs", { silent: true }).code == 127) {
      return console.log(global.lang.cryfsMissing);
    }
    return startUp();
  } catch (e) {
    console.log("Error on startup:", e);
  }
})();
