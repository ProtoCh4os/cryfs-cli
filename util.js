import chalk from 'chalk';
import inquirer from 'inquirer';
import handler from './classes/Handler.js'

const say = input => console.log(chalk.yellow("*"), chalk.cyan(input))
const success = input => console.log(chalk.green("✔"), chalk.greenBright(input))
const fail = input => console.log(chalk.red("✖"), chalk.redBright(input))
const warning = input => console.log(chalk.yellow("⚠"), chalk.yellowBright(input))
const info = input => console.log(chalk.blue("ℹ"), chalk.blueBright(input))
const error = input => console.log(chalk.red("⛔"), chalk.redBright(input))

export default {
  inquirer,
  handler,
  say,
  success,
  fail,
  warning,
  info,
  error
}
