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
      const response = await axios.get(`http://localhost:1555/api/user`, {
        params: { id: member.id },
      });
      console.log("Response data:", response.data);

      if (!response.data) {
        i.reply({
          content: "Kullanıcının diğer bilgileri bulunamadı.",
          ephemeral: true,
        });
      }

      const data = response.data;

      if (!data || !data.base) {
        throw new Error("Geçersiz veri yapısı.");
      }

      const base = data.base;
      const guilds = data.guilds || [];

      const embed = new genEmbed().setDescription(
        `Aşağda kullanıcının diğer sunuculardaki verileri listelenmektedir, Listelenilen bilgiler: İsim, Yaş, Cinsiyet, Diğer Sunuculardaki kayıt verisi.`,
      );
      embed.sütun(`İsim:`, `**${base.topName || "Bilinmiyor"}**`, false);
      embed.sütun(`Yaş:`, `**${base.topAge || "Bilinmiyor"}**`, false);
      embed.sütun(`Cinsiyet:`, `**${base.gender || "Bilinmiyor"}**`, false);

      guilds.map((guild) => {
        embed.sütun(`${guild.serverName}`, `${guild.displayName}`, false);
      });
      message
        .reply({
          embeds: [embed],
        })
        .then((x) => {
          setTimeout(() => {
            x.delete();
          }, 5 * 1000);
        });
    } catch (err) {
      global.logger.error("Bir hata oluştu" + err);
    }
  },
};
