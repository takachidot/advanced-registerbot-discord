const { BaseClient } = require("./utils/BaseClient");
const { Client } = require("discord.js-selfbot-v13");
require("./utils/Base");
const selfClient = new Client();
const client = new BaseClient();
client.fetchCommands();
client.fetchEvents();
client.login(global.config.main.Token);
const { Client } = require("discord.js-selfbot-v13");
const { App } = require("./utils/BaseApp");
selfClient.once("ready", () => {
  global.selfLogger.success(`Logged in as ${client.user.username}!`);
  const app = new App(1555, selfClient);
  app.startServer();
});

selfClient.login(global.config.main.BotSahip_Token);
