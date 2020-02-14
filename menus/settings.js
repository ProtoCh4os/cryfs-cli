import _ from "../util.js";
import Folder from "../classes/Folder.js";
import { mainMenu } from './main.js'
import { updateConfig } from '../classes/Config.js'

export default function () {
  _.inquirer
    .prompt([
      {
        type: "list",
        message: global.lang.settingsChange[0],
        name: "lang",
        choices: ["en_us"]
      },
      {
        type: "input",
        message: global.lang.settingsChange[1],
        name: "vaultsPath",
        default: global.config.vaultsPath,
        validate: input => {
          let folder = new Folder(input);
          if (!folder.exists()) {
            return global.lang.errors.path;
          }
          return true;
        }
      },
      {
        type: "input",
        message: global.lang.settingsChange[2],
        name: "mountingPath",
        default: global.config.mountingPath,
        validate: input => {
          let folder = new Folder(input);
          if (!folder.exists()) {
            return global.lang.pathError;
          }
          return true;
        }
      },
      {
        type: "list",
        message: global.lang.settingsChange[3],
        name: "introduction",
        choices: [`👍 ${global.lang.choices.yes}`,`👎 ${global.lang.choices.no}`]
      },
      {
        type: "list",
        message: global.lang.settingsChange[4],
        name: "confirm",
        choices: [`👍 ${global.lang.choices.yes}`,`👎 ${global.lang.choices.no}`]
      }
    ])
    .then(answers => {
      if (answers.confirm == `👍 ${global.lang.choices.yes}`){
        delete answers.confirm;
        answers.introduction = answers.introduction == `👎 ${global.lang.choices.no}`;
        var settings = global.config;
        global.config = { ...settings, ...answers };

        if (updateConfig(global.config)) {
          _.c.success(global.lang.settingsChange[5]);
        } else {
          _.c.error(global.lang.errors.generic);
        }
      } else {
        _.c.fail(global.lang.errors.cancel)
      }
      mainMenu()
    });
}
