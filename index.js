import main from "./menus/main.js";
import { set as config } from "./classes/Config.js";
import { set as lang } from "./classes/Lang.js";

config().then(() => {
  lang().then(() => {
    main.startUp();
  });
});
