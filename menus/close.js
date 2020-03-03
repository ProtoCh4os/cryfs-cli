import _ from "../util.js";
import { mainMenu } from "./main.js";

export default function() {
  try {
    var folders = _.handler.getMountedVaults();
    if (folders.length == 0) {
      _.c.error(global.lang.errors.noOpenVaults);
      return mainMenu();
    } else {
      return _.inquirer
        .prompt([
          {
            type: "list",
            message: global.lang.close.choose,
            name: "vault",
            choices: folders
          }
        ])
        .then(answers => {
          try {
            _.handler
              .unmountVault(answers.vault)
              .then(res => {
                if (res.success) {
                  _.c.success(res.msg);
                } else {
                  _.c.error(res.msg);
                }
                return mainMenu();
              });
          } catch (er) {
            _.c.error(er);
          }
        })
        .catch(_ => {});
    }
  } catch (e) {
    _.c.error(e);
    return mainMenu();
  }
}
