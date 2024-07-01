const {
  Client,
  Message,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const { genEmbed } = require("../../utils/Embed");

module.exports = {
  name: "teyit",
  aliases: ["kayıtlarım"],
  usage: "teyit <@takachi/ID>",
  description: ".",
  category: "istatistik",
  Extend: true,

  /**
   * @param {Client} client
   */
  onLoad: function (client) {},

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array<String>} args
   */
  onRequest: async function (client, message, args) {
    try {
      let member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.member;
      let erkekTeyit = global.db.get(`${member.id}.kayıtpuan.erkek`);
      let kadınTeyit = global.db.get(`${member.id}.kayıtpuan.kadın`);
      if (erkekTeyit < 0) {
        erkekTeyit = "Yok";
      }
      if (kadınTeyit < 0) {
        kadınTeyit = "Yok";
      }
      let teyitVerisi =
        erkekTeyit + kadınTeyit > 0
          ? erkekTeyit + kadınTeyit
          : "Teyit verisi yok";
      message.channel.send({
        embeds: [
          new genEmbed()
            .setAuthor({
              name: member.user.tag,
              iconURL: member.user.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(
              `${member} kullanıcısının teyit verisi.\n* Toplam Teyit: **${teyitVerisi ? `\nToplam ${teyitVerisi}\nErkek Teyit: ${erkekTeyit}\nKadın Teyit: ${kadınTeyit}` : ""}`,
            ),
        ],
      });
    } catch (err) {
      global.logger.error("Bir hata oluştu" + err);
    }
  },
};
