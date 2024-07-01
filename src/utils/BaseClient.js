const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const { genEmbed } = require("./Embed");

class BaseClient extends Client {
  constructor() {
    super({
      intents: Object.values(GatewayIntentBits),
      partials: Object.values(Partials),
    });
    this.embed = global.embed = new genEmbed();
    require("./Prototype")(this);
    this.commands = new Collection();
    this.aliases = new Collection();
  }

  async fetchCommands() {
    let dirnames = fs.readdirSync("./Commands", { encoding: "utf8" });
    global.logger.info(`${dirnames.length} kategori yüklenecek.`);
    dirnames.forEach(async (dirname) => {
      let files = fs
        .readdirSync(`../Commands/${dirname}`, {
          encoding: "utf8",
        })
        .filter((f) => f.endsWith(".js"));
      global.logger.info(`${files.length} komut yüklenecek`);
      files.forEach(async (file) => {
        let ref = require(`../Commands/${dirname}/${file}`);
        if (ref.onLoad != undefined && typeof ref.onLoad == "function")
          ref.onLoad(this);
        this.commands.set(ref.name, ref);
        if (ref.command)
          ref.command.forEach((alias) => this.aliases.set(alias, ref));
      });
    });
  }

  async fetchEvents() {
    let dirs = fs.readdirSync("./Events", { encoding: "utf8" });
    dirs.forEach((dir) => {
      let files = fs
        .readdirSync(`../Events/${dir}`, {
          encoding: "utf8",
        })
        .filter((file) => file.endsWith(".js"));
      files.forEach((file) => {
        let ref = require(`../Events/${dir}/${file}`);
        this.on(ref.config.Event, ref);
      });
    });
  }
}

module.exports = {
  BaseClient,
};
