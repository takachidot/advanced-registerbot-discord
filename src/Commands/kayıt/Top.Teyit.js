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
  name: "topteyit",
  aliases: ["teyit-sıralama"],
  usage: "topteyit",
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
      const usersWithRank = client.users.cache
        .filter((user) => {
          const toplamTeyit = global.db.get(`${user.id}.kayıtpuan.toplam`);
        })
        .map((user) => ({
          user,
          erkekTeyit: global.db.get(`${user.id}.kayıtpuan.erkek`),
          kadınTeyit: global.db.get(`${user.id}.kayıtpuan.kadın`),
          toplamTeyit: global.db.get(`${user.id}.kayıtpuan.toplam`),
        }))
        .sort(
          (a, b) =>
            b.toplamTeyit - a.toplamTeyit ||
            b.erkekTeyit - a.erkekTeyit ||
            b.kadınTeyit - a.kadınTeyit,
        );
      const targetUserIndex = usersWithRank.findIndex(
        (entry) => entry.user.id === targetUserId,
      );
      const targetUserPage = Math.floor(targetUserIndex / pageSize);
      let page = 0;
      const pageSize = 10;
      const userRank = targetUserIndex + 1;
      const userPage = targetUserPage + 1;

      const content = usersWithRank.map(
        ({ user, toplamTeyit, erkekTeyit, kadınTeyit }, index) => {
          return `${index + 1}. <@${user.id}> Toplam **${toplamTeyit}** (**${erkekTeyit}** Erkek. **${kadınTeyit}** Kadın.)`;
        },
      );

      const totalPages = Math.ceil(content.length / pageSize);

      const embed = genEmbed()
        .setTitle(
          `${message.guild.name} Sunucusunun Teyit Sıralaması | Sıranız: ${userRank}, Sayfa: ${userPage}`,
        )
        .setDescription(
          content.length > 0
            ? content.slice(page * pageSize, (page + 1) * pageSize).join("\n")
            : "Teyit sıralaması bulunamadı.",
        )
        .setFooter({
          text: `Sayfa ${page + 1}/${totalPages}`,
          iconURL: message.guild.iconURL({ dynamic: true }),
        });

      const backButton = new ButtonBuilder()
        .setLabel("◀")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("back");

      const pageButton = new ButtonBuilder()
        .setEmoji("⏰")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true)
        .setCustomId("dasdsdsdsa");

      const nextButton = new ButtonBuilder()
        .setLabel("▶")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("next");

      const actionRow = new ActionRowBuilder().addComponents(
        backButton,
        pageButton,
        nextButton,
      );
      const msg = message.channel.send({
        embeds: [embed],
        components: [actionRow],
      });

      setTimeout(() => {
        msg.delete();
      }, 30 * 1000);

      const filter = (i) => i.user.id === interaction.user.id;
      const collector = msg.createMessageComponentCollector({
        filter,
        componentType: ComponentType.Button,
        time: 60000,
      });

      collector.on("collect", async (i) => {
        if (!i.isButton()) return;

        if (i.customId === "back" && page > 0) {
          page--;
        } else if (i.customId === "next" && page < totalPages - 1) {
          page++;
        }

        const updatedEmbed = new genEmbed()
          .setTitle(
            `${message.guild.name} Sunucusunun Teyit Sıralaması | Sıranız: ${userRank}, Sayfa: ${userPage}`,
          )
          .setDescription(
            content.length > 0
              ? content.slice(page * pageSize, (page + 1) * pageSize).join("\n")
              : "Teyit sıralaması bulunamadı.",
          )
          .setFooter({
            text: `Sayfa ${page + 1}/${totalPages}`,
            iconURL: message.guild.iconURL({ dynamic: true }),
          });

        await i.update({ embeds: [updatedEmbed], components: [actionRow] });
      });
    } catch (err) {
      global.logger.error("Bir hata oluştu." + err);
    }
  },
};
