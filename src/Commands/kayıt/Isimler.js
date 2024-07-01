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
      let kayitVerisi = global.db.get(`${member.id}.kayıtlar`);
      if (kayitVerisi.lenght < 0) {
        return message.reply({
          content: "Eski kayıt verisi bulunamadı.",
        });
      }
      let kayitlarMesaj = `@${guildMember.user.username} adlı kullanıcının geçmiş kayıtları:\n`;
      eskiKayitlar.forEach((kayit, index) => {
        kayitlarMesaj += `${index + 1}. @${guildMember.user.username} = ${kayit.isim} ${kayit.yaş} <@${kayit.yetkili}> (${(kayit.cinsiyet = "Kadın" ? `${global.config.roller.kadınRolleri.map((x) => `<@&${x}>`).join(", ")}` : `${global.config.roller.erkekRolleri.map((x) => `<@&${x}>`).join(", ")}`)})\n`;
      });
      message.reply({
        embeds: [
          new genEmbed()
            .setTitle(`${member} Kullanıcısının Kayıt Verisi`)
            .setDescription(`${kayitlarMesaj}`)
            .setAuthor({
              name: member.user.tag,
              iconURL: member.user.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });
    } catch (err) {
      global.logger.error("Bir hata oluştu" + err);
    }
  },
};
