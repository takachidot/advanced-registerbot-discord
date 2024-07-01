const { Message, ChannelType } = require("discord.js");

/**
 * @param {Message} message
 */

module.exports = async (message) => {
  if (
    message.author.bot ||
    !message.guild ||
    message.channel.type === ChannelType.DM ||
    message.channel.type === ChannelType.GroupDM
  )
    return;

  const client = message.client;
  const content = message.content.slice(1).trim();
  const args = content.split("/ +/");
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command) || client.aliases.get(command);
  if (
    !global.config.kanallar.izinliKanallar.includes(message.channel.id) &&
    message.member.permissions.has("Administrator")
  ) {
    return message
      .reply({
        content: `Sadece izinli kanallarda kullanılabilir: ${global.config.kanallar.izinliKanallar.map((x) => `<#${x}>`).join(", ")}`,
      })
      .then((x) => {
        setTimeout(() => {
          x.delete();
        }, 15000);
      });
  }
  if (cmd) {
    cmd.onRequest(client, message, args);
  }
};

module.exports.config = {
  Event: "messageCreate",
};
