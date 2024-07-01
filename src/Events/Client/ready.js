const { Message, ChannelType, Client, ActivityType } = require("discord.js");

/**
 * @param {Client} client
 */

module.exports = async (client) => {
  client.user.setActivity({
    name: "takachi was here.",
    type: ActivityType.Watching,
  });
  client.user.setStatus("idle");
};

module.exports.config = {
  Event: "ready",
};
