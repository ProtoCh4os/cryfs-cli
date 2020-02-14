import _ from "../util.js";
import settings from './settings.js'
import open from './open.js'
import close from './close.js'
import create from './create.js'
import remove from './remove.js'

export function startUp() {
  console.log(_.c.title(_.lang.welcome));

  if (_.handler.settings.introduction) {
    console.log(_.c.title(_.lang.intro));
  }

  mainMenu()
}

export function mainMenu() {
  _.inquirer
  .prompt([
    {
      type: "list",
      message: _.lang.menu.prompt,
      name: "menu",
      choices: [
        _.lang.menu.openVault,
        _.lang.menu.closeVault,
        _.lang.menu.createVault,
        _.lang.menu.deleteVault,
        _.lang.menu.settings,
        _.lang.menu.exit
      ]
    }
  ])
  .then(answers => {
    var menu = {};
    menu[_.lang.menu.openVault] = open;
    menu[_.lang.menu.closeVault] = close;
    menu[_.lang.menu.createVault] = create;
    menu[_.lang.menu.deleteVault] = remove;
    menu[_.lang.menu.settings] = settings;
    menu[_.lang.menu.exit] = exit;

    menu[answers.menu]();
  });
}

export function exit() {
  _.c.say(_.lang.goodbye);
}

export default {
  startUp,
  mainMenu,
  exit
};
