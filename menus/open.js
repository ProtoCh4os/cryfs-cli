import _ from "../util.js";
import { mainMenu } from './main.js';

export default function() {
  try{
    var folders = _.handler.readVaults();
  } catch (e) {
    _.c.error(e)
    mainMenu();
  }


}
