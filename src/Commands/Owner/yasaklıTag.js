const { Client, Message } = require("discord.js");

module.exports = {
  name: "yasaklıTag",
  aliases: ["forbiden-tag"],
  usage: ".yasaklıTag ekle/çıkar/liste/temizle",
  description: "Yasaklı Tag ekle/sil/listele/temizle",
  category: "botOwner",
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
    if (!config.main.botOwner.includes(message.autor.id)) return;
    let arg = args[1];
    let tag = args[2];
    if (!arg)
      return message.channel.send({
        content: `doğru kullanım: ${global.config.main.prefix[0]}yasaklıTag ekle/sil/listele/sıfırla`,
      });
    if (arg === "ekle") {
      if (!tag)
        return message.channel.send({
          content: `doğru kullanım: ${global.config.main.prefix[0]}yasaklıTag ekle $`,
        });
      global.yasaklıTag.push("yasaklıTag", tag);
      message.reply({
        content: `Başarıyla ${tag} tagı yasaklı tag listesine eklenmiştir.`,
      });
    }
    if (arg === "kaldır") {
      if (!tag)
        return message.channel.send({
          content: `doğru kullanım: ${global.config.main.prefix[0]}yasaklıTag kaldır $`,
        });
      global.yasaklıTag.unpush("yasaklıTag", tag);
      message.reply({
        content: `Başarıyla ${tag} tagı yasaklı tag listesinden kaldırılmıştır.`,
      });
    }
    if (arg === "list") {
      const yasaklıTaglar = global.yasaklıTag.get("yasaklıTag");
      message.reply({
        embeds: client
          .embed()
          .setAuthor({
            name: message.autor.tag,
            iconURL: message.member.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(`${yasaklıTaglar.map((x) => x).join("\n")}`),
      });
    }
    if (arg === "temizle") {
      global.yasaklıTag.clear();
      message.reply({
        content: `Başarıyla temizlendi.`,
      });
    }
  },
};
