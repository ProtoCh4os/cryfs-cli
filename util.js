import chalk from "chalk";
import boxen from "boxen";
import inquirer from "inquirer";
import Handler from "./classes/Handler.js";
import Lang from "./classes/Lang.js";

const title = input => boxen(input, { padding: 1 });
const say = input => console.log(chalk.yellow("*"), chalk.cyan(input));
const success = input =>
  console.log(chalk.green("✔"), chalk.greenBright(input));
const fail = input => console.log(chalk.red("✖"), chalk.redBright(input));
const warning = input =>
  console.log(chalk.yellow("⚠"), chalk.yellowBright(input));
const info = input => console.log(chalk.blue("ℹ"), chalk.blueBright(input));
const error = input => console.log(chalk.red("⛔"), chalk.redBright(input));

const c = {
  title,
  say,
  success,
  fail,
  warning,
  info,
  error
};
const handler = new Handler();
const lang = Lang(handler.settings.lang);
handler.lang = lang;

export default {
  inquirer,
  lang,
  handler,
  c
};
