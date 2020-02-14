import _ from "../util.js";
import Folder from "../classes/Folder.js";
import { mainMenu } from './main.js'

export default function () {
  _.inquirer
    .prompt([
      {
        type: "list",
        message: _.lang.settingsChange[0],
        name: "lang",
        choices: ["en_us"]
      },
      {
        type: "input",
        message: _.lang.settingsChange[1],
        name: "vaultsPath",
        default: _.handler.settings.vaultsPath,
        validate: input => {
          let folder = new Folder(input);
          if (!folder.exists()) {
            return _.lang.errors.path;
          }
          return true;
        }
      },
      {
        type: "input",
        message: _.lang.settingsChange[2],
        name: "mountingPath",
        default: _.handler.settings.mountingPath,
        validate: input => {
          let folder = new Folder(input);
          if (!folder.exists()) {
            return _.lang.pathError;
          }
          return true;
        }
      },
      {
        type: "list",
        message: _.lang.settingsChange[3],
        name: "introduction",
        choices: [`👍 ${_.lang.choices.yes}`,`👎 ${_.lang.choices.no}`]
      },
      {
        type: "list",
        message: _.lang.settingsChange[4],
        name: "confirm",
        choices: [`👍 ${_.lang.choices.yes}`,`👎 ${_.lang.choices.no}`]
      }
    ])
    .then(answers => {
      if (answers.confirm == `👍 ${_.lang.choices.yes}`){
        delete answers.confirm;
        answers.introduction = answers.introduction == `👎 ${_.lang.choices.no}`;
        var settings = _.handler.settings;
        _.handler.settings = { ...settings, ...answers };
        if (_.handler.updateConfig()) {
          _.c.success();
        }
      } else {
        _.c.fail(_.lang.errors.cancel)
      }
      mainMenu()
    });
}
