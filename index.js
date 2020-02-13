import _ from "./util.js";
import Folder from "./classes/Folder.js";

// App installation: /usr/share/cryfs-cli
// Vaults path: /var/lib/cryfs-cli

console.log(_.c.title(_.lang.welcome));

if (_.handler.settings.introduction) {
  console.log(_.c.title(_.lang.intro));
}

var menu = {};
menu[_.lang.openVault] = () => {};
menu[_.lang.closeVault] = () => {};
menu[_.lang.createVault] = () => {};
menu[_.lang.deleteVault] = () => {};
menu[_.lang.settings] = () => {};
menu[_.lang.exit] = () => {
  _.c.say(_.lang.goodbye)
};

_.inquirer
  .prompt([
    {
      type: "list",
      message: _.lang.menu1,
      name: "menu",
      choices: [
        _.lang.openVault,
        _.lang.closeVault,
        _.lang.createVault,
        _.lang.deleteVault,
        _.lang.settings,
        _.lang.exit
      ]
    }
  ])
  .then(answers => {
    menu[answers.menu]();
  });
