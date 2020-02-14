import _ from "../util.js";

export default function() {
  var folders = _.handler.readVaults();
  console.log(folders)
}
