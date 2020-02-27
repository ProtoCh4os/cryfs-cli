import _ from "../util.js";
import settings from "./settings.js";
import open from "./open.js";
import close from "./close.js";
import create from "./create.js";
import remove from "./remove.js";

export async function startUp() {
  console.log(_.c.title(global.lang.welcome));

  if (global.config.introduction) {
    console.log(_.c.title(global.lang.intro));
  }

  mainMenu();
}

export function mainMenu() {
  _.inquirer
    .prompt([
      {
        type: "list",
        message: global.lang.menu.prompt,
        name: "menu",
        choices: [
          global.lang.menu.openVault,
          global.lang.menu.closeVault,
          global.lang.menu.createVault,
          global.lang.menu.deleteVault,
          global.lang.menu.settings,
          global.lang.menu.exit
        ]
      }
    ])
    .then(answers => {
      var menu = {};
      menu[global.lang.menu.openVault] = open;
      menu[global.lang.menu.closeVault] = close;
      menu[global.lang.menu.createVault] = create;
      menu[global.lang.menu.deleteVault] = remove;
      menu[global.lang.menu.settings] = settings;
      menu[global.lang.menu.exit] = exit;

      menu[answers.menu]();
    })
    .catch(err => false);
}

export function exit() {
  _.c.say(global.lang.goodbye);
}

export default {
  startUp,
  mainMenu,
  exit
};
