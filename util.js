import chalk from "chalk";
import boxen from "boxen";
import inquirer from "inquirer";
import Handler from "./classes/Handler.js";

const speak = (icon, primary, secondary) => {
  return function(input, showIcon = true) {
    if (!showIcon) {
      console.log(chalk[primary](input));
    } else {
      console.log(chalk[secondary](icon), chalk[primary](input));
    }
  };
};

const c = {
  say: speak("*", "cyan", "yellow"),
  success: speak("✔", "greenBright", "green"),
  fail: speak("✖", "redBright", "red"),
  warning: speak("⚠", "yellowBright", "yellow"),
  info: speak("ℹ", "blueBright", "blue"),
  error: speak("⛔", "redBright", "red"),
  title(input) {
    return boxen(input, { padding: 1 });
  }
};
const handler = new Handler();

export default {
  inquirer,
  handler,
  c
};
