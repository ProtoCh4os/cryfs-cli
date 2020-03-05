import _ from "../util.js";
import { mainMenu } from "./main.js";

export default function() {
  try {
    var allVaults = _.handler.readVaults();
    return _.inquirer
      .prompt([
        {
          type: "list",
          message: global.lang.remove.choose,
          name: "vault",
          choices: allVaults
        },
        {
          type: "list",
          message: global.lang.remove.confirm,
          name: "confirm",
          choices: [
            `👍 ${global.lang.choices.yes}`,
            `👎 ${global.lang.choices.no}`
          ]
        }
      ])
      .then(answers => {
        if (answers.confirm == `👍 ${global.lang.choices.yes}`) {
          try {
            _.handler.removeVault(answers.vault, res => {
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
        } else {
          _.c.warning(global.lang.errors.cancel);
          return mainMenu();
        }
      })
      .catch(_ => {});
  } catch (e) {
    _.c.error(e);
    return mainMenu();
  }
}
