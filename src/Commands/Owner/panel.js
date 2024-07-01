const {
  Client,
  Message,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "panel",
  aliases: ["yapayzekakayıtsistemi"],
  usage: ".",
  description: ".",
  category: "botOwner",
  Extend: true,

  /**
   * @param {Client} client
   */
  onLoad: function (client) {
    client.on("interactionCreate", async (interaction) => {
      if (interaction.isButton()) {
        if (interaction.customId === "yapayzeka") {
          interaction.reply({
            content: "Yapay Zeka Sistemi Başlatılıyor...",
            ephemeral: true,
          });
          const response = global.httpClient.get(
            `http://localhost:1555/api/user?id=${member.user.id}`,
          );
          const data = response.data;
          const gerçekisim = data.base.topName;
          const gerçekyaş = data.base.topAge;
          const cinsiyet = data.base.gender;
          if ((gerçekisim = null))
            return interaction.reply({
              content: "veri çekilemedi, lütfen ses teyit veriniz.",
              ephemeral: true,
            });
          if ((gerçekyaş = null && global.config.main.isimyaş))
            return interaction.reply({
              content: "veri çekilemedi, lütfen ses teyit veriniz.",
              ephemeral: true,
            });
          interaction.member.register(gerçekisim, gerçekyaş, cinsiyet);
        }
      }
    });
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array<String>} args
   */

  onRequest: async function (client, message, args) {
    if (!config.main.botOwner.includes(message.autor.id)) return;
    return message.channel.send({
      content:
        "# YAPAY ZEKA KAYIT SISTEMI\n\n\nAlttaki buton aracılığıyla ses teyite ihtiyaç olmadan kayıt olabilirsiniz, eğer verileriniz çekilemezse veya isminiz unisex bir isim ise teyit vermek zorundasınız.",
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder({
            custom_id: "yapayzeka",
            label: "Kayıt ol",
            style: ButtonStyle.Primary,
          }),
        ),
      ],
    });
  },
};
