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
  category: "kayıt",
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
      if (
        !global.config.roller.teyitciRolleri.some((x) =>
          message.member.roles.cache.get(x),
        ) &&
        !message.member.permissions.has("Administrator")
      )
        return false;
      let member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);
      if (!member) return message.reply({ content: "Üye belirt." });
      if (
        message.member.roles.highest.position <= member.roles.highest.position
      )
        return message
          .reply("Bu kullanıcının yetkisi senden üstün.")
          .then((x) => {
            setTimeout(() => {
              x.delete().catch((err) => {});
            }, 5000);
          });
      if (member.user.bot)
        return message
          .reply("Botlar ne zamandan beri kayıt ediliyor?")
          .then((x) => {
            setTimeout(() => {
              x.delete().catch((err) => {});
            }, 5000);
          });
      let sebep = args.slice(" ");
      if (!sebep)
        return message
          .reply({ content: "Bir sebep belirtmelisin" })
          .then((x) => {
            setTimeout(() => {
              x.delete().catch((err) => {});
            }, 5000);
          });
      let rol = message.guild.roles.cache
        .clone()
        .filter((e) => e.managed)
        .map((e) => e.id)
        .concat(global.config.roller.kayıtsızRolleri);
      member.roles.set(rol);
      message
        .reply({ content: "Kayıtsıza atma işlemi başarıyla tamamlandı." })
        .then((x) => {
          setTimeout(() => {
            x.delete().catch((err) => {});
          }, 5000);
        });
      const kanal = message.guild.kanalBul(global.config.kanallar.kayıtsızLog);
      kanal.send({
        embeds: [
          new genEmbed()
            .setAuthor({
              name: message.author.tag,
              iconURL: member.user.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(
              `${member} kullanıcısı ${message.author} tarafından **${sebep}** sebebiyle kayıtsıza atıldı.`,
            ),
        ],
      });
    } catch (err) {
      global.logger.error("Bir hata oluştu" + err);
    }
  },
};
