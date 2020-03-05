import _ from "../util.js";
import { mainMenu } from "./main.js";

export default function() {
  try {
    var allVaults = _.handler.readVaults();
    return _.inquirer
      .prompt([
        {
          type: "input",
          message: global.lang.create.name,
          name: "name",
          validate: input => {
            if (!input) {
              return global.lang.errors.path;
            }
            if (allVaults.includes(input)) {
              return global.lang.errors.vaultAlreadyExists;
            }
            return true;
          }
        },
        {
          type: "password",
          mask: "*",
          message: global.lang.create.password,
          validate: input => {
            if (!input) {
              return global.lang.errors.invalidPassword;
            }
            return true;
          },
          name: "password"
        },
        {
          type: "password",
          mask: "*",
          message: global.lang.create.retypePassword,
          validate: (input, answers) => {
            if (!input) {
              return global.lang.errors.invalidPassword;
            }

            if (input !== answers.password) {
              return global.lang.errors.passwordsDontMatch;
            }
            return true;
          },
          name: "retype"
        },
        {
          type: "list",
          message: global.lang.create.confirm,
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
            _.handler.createVault(answers.name, answers.password, res => {
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
