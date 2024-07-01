const { Logger } = require("@vlodia/logger");
const { Database, HttpClient } = require("vlodia");

global.config = {
  main: require("../config/main.json"),
  roller: require("../config/roller.json"),
  kanallar: require("../config/kanallar.json"),
  emojiler: require("../config/emojiler.json"),
  cinsiyetler: require("../config/Genders.json"),
};
global.db = new Database("../db.json");
global.yasaklıTag = new Database("../yasaklıTag.json");
global.httpClient = new HttpClient();
global.logger = new Logger("[BOT]:");
global.selfLogger = new Logger("[SELFBOT]:");
