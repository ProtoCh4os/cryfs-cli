import _ from "../util.js";
import { mainMenu } from "./main.js";

export default function() {
  try {
    var folders = _.handler.readVaults();
    return _.inquirer
      .prompt([
        {
          type: "list",
          message: global.lang.open.choose,
          name: "vault",
          choices: folders
        },
        {
          type: "password",
          mask: "*",
          message: global.lang.open.password,
          validate: input => {
            if (!input) {
              return global.lang.errors.invalidPassword;
            }
            return true;
          },
          name: "password",
          choices: folders
        }
      ])
      .then(answers => {
        try {
          _.handler.mountVault(answers.vault, answers.password).then(res => {
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
  } catch (e) {
    _.c.error(e);
    return mainMenu();
  }
}
