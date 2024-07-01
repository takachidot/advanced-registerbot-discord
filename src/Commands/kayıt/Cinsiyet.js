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
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder({
          style: ButtonStyle.Primary,
          custom_id: "man",
          label: "Erkek",
          emoji: {
            id: message.guild.emojiGöster(global.config.emojiler.erkek),
          },
        }),
        new ButtonBuilder({
          style: ButtonStyle.Secondary,
          custom_id: "woman",
          label: "Kadın",
          emoji: {
            id: message.guild.emojiGöster(global.config.emojiler.kadın),
          },
        }),
        new ButtonBuilder({
          style: ButtonStyle.Danger,
          custom_id: "iptal",
          emoji: {
            id: message.guild.emojiGöster(global.config.emojiler.iptal),
          },
        }),
      );
      const embed = new genEmbed()
        .setAuthor({
          name: message.author.tag,
          iconURL: message.member.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          `${member} kullanıcısının cinsiyetini alttaki butonlardan  belirleyebilirsiniz`,
        );
      const msg = await message.channel.send({
        embeds: [embed],
        components: [row],
      });
      setTimeout(() => {
        msg.delete;
      }, 15 * 1000);
      const filter = (i) => i.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({
        filter,
        time: 15 * 1000,
        componentType: ComponentType.Button,
      });
      collector.on("collect", async (i) => {
        if (i.customId === "man") {
          const embed = new genEmbed()
            .setAuthor({
              name: message.author.tag,
              iconURL: message.member.user.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(
              `${member} kullanıcısının cinsiyet başarıyla **Erkek** olarak değiştirildi.`,
            );

          member.register("Cinsiyet", "Değiştirme", "Erkek", message.author.id);
          msg.edit({
            embeds: [embed],
          });
        }
        if (i.customId === "woman") {
          const embed = new genEmbed()
            .setAuthor({
              name: message.author.tag,
              iconURL: message.member.user.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(
              `${member} kullanıcısının cinsiyeti başarıyla **Kadın** olarak değiştirildi.`,
            );
          member.register("Cinsiyet", "Değiştirme", "Kadın", message.author.id);
          msg.edit({
            embeds: [embed],
          });
        }
        if (i.customId === "iptal") {
          i.deferUpdate();
          msg.delete().catch((err) => {});
        }
      });
    } catch (err) {
      global.logger.error("Bir hata oluştu" + err);
    }
  },
};
