import main from "./menus/main.js";
import { set as config } from "./classes/Config.js";
import { set as lang } from "./classes/Lang.js";

(async () => {
  try {
    await config();
    await lang();
    return main.startUp();
  } catch (e) {
    console.log("Error on startup:", e);
  }
})();
